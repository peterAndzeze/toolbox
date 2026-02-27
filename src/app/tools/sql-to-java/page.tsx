"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const SAMPLE_SQL = `CREATE TABLE \`user_info\` (
  \`id\` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  \`username\` VARCHAR(255) NOT NULL COMMENT '用户名',
  \`email\` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  \`age\` INT DEFAULT 0 COMMENT '年龄',
  \`balance\` DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  \`is_active\` TINYINT(1) DEFAULT 1 COMMENT '是否激活',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';`;

interface ColumnDef {
  name: string;
  type: string;
  comment: string;
  isPrimary: boolean;
  nullable: boolean;
}

const SQL_TYPE_MAP: Record<string, string> = {
  VARCHAR: "String",
  CHAR: "String",
  TEXT: "String",
  LONGTEXT: "String",
  MEDIUMTEXT: "String",
  TINYTEXT: "String",
  INT: "Integer",
  INTEGER: "Integer",
  BIGINT: "Long",
  SMALLINT: "Integer",
  TINYINT: "Integer",
  MEDIUMINT: "Integer",
  FLOAT: "Float",
  DOUBLE: "Double",
  DECIMAL: "BigDecimal",
  NUMERIC: "BigDecimal",
  DATETIME: "LocalDateTime",
  TIMESTAMP: "LocalDateTime",
  DATE: "LocalDate",
  TIME: "LocalTime",
  YEAR: "Integer",
  BOOLEAN: "Boolean",
  BIT: "Boolean",
  BLOB: "byte[]",
  LONGBLOB: "byte[]",
  MEDIUMBLOB: "byte[]",
  TINYBLOB: "byte[]",
};

function snakeToPascal(str: string): string {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}

function snakeToCamel(str: string): string {
  const pascal = snakeToPascal(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function parseSql(sql: string): { tableName: string; tableComment: string; columns: ColumnDef[] } {
  const normalized = sql.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let tableName = "";
  let tableComment = "";

  const tableMatch = normalized.match(/CREATE\s+TABLE\s+(?:`?(\w+)`?|"(\w+)")\s*\(/i);
  if (tableMatch) {
    tableName = (tableMatch[1] || tableMatch[2] || "").trim();
  }

  const commentMatch = normalized.match(/COMMENT\s*=\s*['"]([^'"]*)['"]/i);
  if (commentMatch) {
    tableComment = commentMatch[1];
  }

  const pkMatch = normalized.match(/PRIMARY\s+KEY\s*\([`"]?(\w+)[`"]?\)/i);
  const primaryKey = pkMatch ? pkMatch[1].replace(/`/g, "") : "";

  const columns: ColumnDef[] = [];
  const colBlock = normalized.replace(/CREATE\s+TABLE\s+[\s\S]+?\(/i, "").replace(/\)[\s\S]*$/, "");
  const lines = colBlock.split(/,(?![^(]*\))/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^\s*PRIMARY\s+KEY/i.test(trimmed) || /^\s*KEY\s+/i.test(trimmed) || /^\s*UNIQUE\s+/i.test(trimmed) || /^\s*INDEX\s+/i.test(trimmed) || /^\s*FOREIGN\s+KEY/i.test(trimmed)) continue;

    const colMatch = trimmed.match(/^[`"]?(\w+)[`"]?\s+(\w+)(?:\([^)]+\))?\s*(.*)$/i);
    if (!colMatch) continue;

    const colName = colMatch[1].replace(/`/g, "");
    const sqlType = colMatch[2].toUpperCase();
    const rest = colMatch[3];

    const nullable = !/NOT\s+NULL/i.test(rest);
    const commentMatch2 = rest.match(/COMMENT\s+['"]([^'"]*)['"]/i);
    const comment = commentMatch2 ? commentMatch2[1] : "";
    const isPrimary = colName === primaryKey || /AUTO_INCREMENT/i.test(rest);

    let javaType = SQL_TYPE_MAP[sqlType];
    if (!javaType) {
      if (sqlType.startsWith("VARCHAR") || sqlType.startsWith("CHAR") || sqlType.startsWith("TEXT")) javaType = "String";
      else if (sqlType.startsWith("INT") || sqlType.startsWith("BIGINT") || sqlType.startsWith("SMALLINT") || sqlType.startsWith("TINYINT") || sqlType.startsWith("MEDIUMINT")) javaType = sqlType.includes("BIG") ? "Long" : "Integer";
      else if (sqlType.startsWith("DECIMAL") || sqlType.startsWith("NUMERIC")) javaType = "BigDecimal";
      else if (sqlType.startsWith("DATETIME") || sqlType.startsWith("TIMESTAMP")) javaType = "LocalDateTime";
      else if (sqlType.startsWith("DATE")) javaType = "LocalDate";
      else if (sqlType.startsWith("FLOAT")) javaType = "Float";
      else if (sqlType.startsWith("DOUBLE")) javaType = "Double";
      else if (sqlType.startsWith("BOOLEAN") || sqlType.startsWith("BIT")) javaType = "Boolean";
      else if (sqlType.startsWith("BLOB")) javaType = "byte[]";
      else javaType = "String";
    }

    columns.push({ name: colName, type: javaType, comment, isPrimary, nullable });
  }

  return { tableName, tableComment, columns };
}

function generateJava(
  tableName: string,
  tableComment: string,
  columns: ColumnDef[],
  opts: { lombok: boolean; jpa: boolean; mybatis: boolean; swagger: boolean; serializable: boolean }
): string {
  const className = snakeToPascal(tableName);
  const lines: string[] = [];

  const imports = new Set<string>();
  if (opts.jpa) {
    imports.add("import javax.persistence.*;");
  }
  if (opts.mybatis) {
    imports.add("import com.baomidou.mybatisplus.annotation.*;");
  }
  if (opts.swagger) {
    imports.add("import io.swagger.annotations.ApiModelProperty;");
  }
  if (columns.some((c) => c.type === "BigDecimal")) imports.add("import java.math.BigDecimal;");
  if (columns.some((c) => c.type === "LocalDateTime" || c.type === "LocalDate" || c.type === "LocalTime")) {
    imports.add("import java.time.LocalDateTime;");
    imports.add("import java.time.LocalDate;");
    imports.add("import java.time.LocalTime;");
  }
  if (opts.serializable) imports.add("import java.io.Serializable;");

  lines.push("package com.example.entity;");
  lines.push("");
  imports.forEach((i) => lines.push(i));
  if (imports.size) lines.push("");

  if (opts.lombok) lines.push("@Data");
  if (opts.jpa) {
    lines.push("@Entity");
    lines.push(`@Table(name = "${tableName}")`);
  }
  if (opts.mybatis) lines.push(`@TableName("${tableName}")`);
  lines.push(`public class ${className}${opts.serializable ? " implements Serializable" : ""} {`);
  if (opts.serializable) lines.push("    private static final long serialVersionUID = 1L;");
  lines.push("");

  for (const col of columns) {
    const fieldName = snakeToCamel(col.name);
    if (opts.swagger && col.comment) lines.push(`    @ApiModelProperty(value = "${col.comment.replace(/"/g, '\\"')}")`);
    if (opts.jpa) {
      if (col.isPrimary) lines.push("    @Id");
      lines.push(`    @Column(name = "${col.name}"${col.nullable ? "" : ", nullable = false"})`);
    }
    if (opts.mybatis) {
      if (col.isPrimary) lines.push("    @TableId(type = IdType.AUTO)");
      else lines.push(`    @TableField("${col.name}")`);
    }
    lines.push(`    private ${col.type} ${fieldName};`);
    lines.push("");
  }

  if (!opts.lombok) {
    for (const col of columns) {
      const fieldName = snakeToCamel(col.name);
      const cap = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      lines.push(`    public ${col.type} get${cap}() { return ${fieldName}; }`);
      lines.push(`    public void set${cap}(${col.type} ${fieldName}) { this.${fieldName} = ${fieldName}; }`);
      lines.push("");
    }
  }

  lines.push("}");
  return lines.join("\n");
}

export default function SqlToJavaPage() {
  const [sql, setSql] = useState("");
  const [output, setOutput] = useState("");
  const [lombok, setLombok] = useState(true);
  const [jpa, setJpa] = useState(false);
  const [mybatis, setMybatis] = useState(true);
  const [swagger, setSwagger] = useState(false);
  const [serializable, setSerializable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    setError("");
    if (!sql.trim()) {
      setError("请输入 SQL 建表语句");
      return;
    }
    try {
      const { tableName, tableComment, columns } = parseSql(sql);
      if (!tableName || columns.length === 0) {
        setError("无法解析表名或列，请检查 SQL 格式");
        return;
      }
      const code = generateJava(tableName, tableComment, columns, {
        lombok,
        jpa,
        mybatis,
        swagger,
        serializable,
      });
      setOutput(code);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [sql, lombok, jpa, mybatis, swagger, serializable]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const loadSample = useCallback(() => {
    setSql(SAMPLE_SQL);
  }, []);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">SQL 转 Java 实体类</h1>
      <p className="page-subtitle">粘贴 SQL 建表语句，自动生成 Java 实体类，支持 Lombok、JPA、MyBatis-Plus、Swagger 注解</p>

      <div className="card mt-6 rounded-xl p-4">
        <div className="mb-4 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={lombok} onChange={(e) => setLombok(e.target.checked)} className="rounded" />
            <span className="text-sm">Lombok @Data</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={jpa} onChange={(e) => setJpa(e.target.checked)} className="rounded" />
            <span className="text-sm">JPA 注解</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={mybatis} onChange={(e) => setMybatis(e.target.checked)} className="rounded" />
            <span className="text-sm">MyBatis-Plus 注解</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={swagger} onChange={(e) => setSwagger(e.target.checked)} className="rounded" />
            <span className="text-sm">Swagger @ApiModelProperty</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={serializable} onChange={(e) => setSerializable(e.target.checked)} className="rounded" />
            <span className="text-sm">Serializable</span>
          </label>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={generate} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
            生成 Java 实体类
          </button>
          <button onClick={loadSample} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
            加载示例 SQL
          </button>
          {output && (
            <button onClick={copyCode} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
              {copied ? "已复制 ✓" : "复制代码"}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">SQL 建表语句</label>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="粘贴 CREATE TABLE 语句..."
              className="textarea-tool h-80 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">生成的 Java 代码</label>
            <pre className="textarea-tool h-80 w-full overflow-auto rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
              {output || "点击「生成 Java 实体类」查看结果"}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
