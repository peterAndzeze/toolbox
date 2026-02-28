"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const SAMPLE_SQL = `CREATE TABLE \`order_detail\` (
  \`id\` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  \`order_no\` VARCHAR(64) NOT NULL COMMENT '订单号',
  \`user_id\` BIGINT NOT NULL COMMENT '用户ID',
  \`product_name\` VARCHAR(255) NOT NULL COMMENT '商品名称',
  \`sku_code\` VARCHAR(128) DEFAULT NULL COMMENT 'SKU编码',
  \`quantity\` INT NOT NULL DEFAULT 1 COMMENT '数量',
  \`unit_price\` DECIMAL(12,2) NOT NULL COMMENT '单价',
  \`total_amount\` DECIMAL(12,2) NOT NULL COMMENT '总金额',
  \`discount\` DECIMAL(5,2) DEFAULT 0.00 COMMENT '折扣',
  \`status\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态 0-待支付 1-已支付 2-已取消',
  \`remark\` TEXT DEFAULT NULL COMMENT '备注',
  \`shipping_address\` VARCHAR(500) DEFAULT NULL COMMENT '收货地址',
  \`paid_at\` DATETIME DEFAULT NULL COMMENT '支付时间',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  \`is_deleted\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (\`id\`),
  KEY \`idx_order_no\` (\`order_no\`),
  KEY \`idx_user_id\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';`;

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
  ENUM: "String",
  SET: "String",
  JSON: "String",
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
  BINARY: "byte[]",
  VARBINARY: "byte[]",
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
  const normalized = sql.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  let tableName = "";
  let tableComment = "";

  const tableMatch = normalized.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`(\w+)`|"(\w+)"|(\w+))\s*\(/i);
  if (tableMatch) {
    tableName = (tableMatch[1] || tableMatch[2] || tableMatch[3] || "").trim();
  }

  const tblCommentMatch = normalized.match(/\)\s*[^;]*COMMENT\s*=?\s*['"]([^'"]*)['"]/i);
  if (tblCommentMatch) {
    tableComment = tblCommentMatch[1];
  }

  const startIdx = normalized.indexOf("(", normalized.search(/CREATE\s+TABLE/i));
  if (startIdx === -1) return { tableName, tableComment, columns: [] };

  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < normalized.length; i++) {
    if (normalized[i] === "(") depth++;
    else if (normalized[i] === ")") {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) return { tableName, tableComment, columns: [] };

  const colBlock = normalized.substring(startIdx + 1, endIdx);

  const lines: string[] = [];
  let current = "";
  let parenDepth = 0;
  let inQuote = false;
  let quoteChar = "";
  for (let i = 0; i < colBlock.length; i++) {
    const ch = colBlock[i];
    if (inQuote) {
      current += ch;
      if (ch === quoteChar) inQuote = false;
      continue;
    }
    if (ch === "'" || ch === '"') {
      inQuote = true;
      quoteChar = ch;
      current += ch;
      continue;
    }
    if (ch === "(") parenDepth++;
    else if (ch === ")") parenDepth--;
    else if (ch === "," && parenDepth === 0) {
      lines.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) lines.push(current.trim());

  let primaryKey = "";
  for (const line of lines) {
    const pkMatch = line.match(/^\s*PRIMARY\s+KEY\s*\(\s*[`"]?(\w+)[`"]?\s*\)/i);
    if (pkMatch) { primaryKey = pkMatch[1]; break; }
  }

  const columns: ColumnDef[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\s*(?:PRIMARY\s+KEY|UNIQUE\s+(?:KEY|INDEX)|KEY\s+|INDEX\s+|FOREIGN\s+KEY|CONSTRAINT\s+)/i.test(trimmed)) continue;

    const colMatch = trimmed.match(/^[`"]?(\w+)[`"]?\s+(\w+)(?:\s*\([^)]*\))?(?:\s+UNSIGNED)?(?:\s+ZEROFILL)?\s*(.*)?$/i);
    if (!colMatch) continue;

    const colName = colMatch[1];
    const sqlType = colMatch[2].toUpperCase();
    const rest = colMatch[3] || "";

    const nullable = !/NOT\s+NULL/i.test(rest);
    const colCommentMatch = rest.match(/COMMENT\s+['"]([^'"]*)['"]/i);
    const comment = colCommentMatch ? colCommentMatch[1] : "";
    const isPrimary = colName === primaryKey || /AUTO_INCREMENT/i.test(rest);

    const javaType = SQL_TYPE_MAP[sqlType] || "String";
    columns.push({ name: colName, type: javaType, comment, isPrimary, nullable });
  }

  return { tableName, tableComment, columns };
}

interface GenOpts {
  lombok: boolean;
  jpa: boolean;
  mybatis: boolean;
  swagger: boolean;
  serializable: boolean;
  springBoot3: boolean;
}

function generateJava(tableName: string, tableComment: string, columns: ColumnDef[], opts: GenOpts): string {
  const className = snakeToPascal(tableName);
  const lines: string[] = [];
  const imports = new Set<string>();

  if (opts.jpa) {
    imports.add(opts.springBoot3 ? "import jakarta.persistence.*;" : "import javax.persistence.*;");
  }
  if (opts.mybatis) {
    imports.add("import com.baomidou.mybatisplus.annotation.*;");
  }
  if (opts.swagger) {
    if (opts.springBoot3) {
      imports.add("import io.swagger.v3.oas.annotations.media.Schema;");
    } else {
      imports.add("import io.swagger.annotations.ApiModel;");
      imports.add("import io.swagger.annotations.ApiModelProperty;");
    }
  }
  if (columns.some((c) => c.type === "BigDecimal")) imports.add("import java.math.BigDecimal;");
  if (columns.some((c) => c.type === "LocalDateTime")) imports.add("import java.time.LocalDateTime;");
  if (columns.some((c) => c.type === "LocalDate")) imports.add("import java.time.LocalDate;");
  if (columns.some((c) => c.type === "LocalTime")) imports.add("import java.time.LocalTime;");
  if (opts.serializable) imports.add("import java.io.Serializable;");
  if (opts.lombok) {
    imports.add("import lombok.Data;");
  }

  lines.push("package com.example.entity;");
  lines.push("");
  const sortedImports = [...imports].sort();
  sortedImports.forEach((i) => lines.push(i));
  if (imports.size) lines.push("");

  if (tableComment) lines.push(`/**\n * ${tableComment}\n */`);
  if (opts.lombok) lines.push("@Data");
  if (opts.swagger) {
    if (opts.springBoot3) {
      lines.push(`@Schema(description = "${tableComment || className}")`);
    } else {
      lines.push(`@ApiModel(value = "${className}", description = "${tableComment || ""}")`);
    }
  }
  if (opts.jpa) {
    lines.push("@Entity");
    lines.push(`@Table(name = "${tableName}")`);
  }
  if (opts.mybatis) lines.push(`@TableName("${tableName}")`);

  const implParts: string[] = [];
  if (opts.serializable) implParts.push("Serializable");

  lines.push(`public class ${className}${implParts.length ? " implements " + implParts.join(", ") : ""} {`);
  if (opts.serializable) {
    lines.push("");
    lines.push("    private static final long serialVersionUID = 1L;");
  }

  for (const col of columns) {
    const fieldName = snakeToCamel(col.name);
    lines.push("");
    if (col.comment && !opts.swagger) {
      lines.push(`    /** ${col.comment} */`);
    }
    if (opts.swagger) {
      if (opts.springBoot3) {
        lines.push(`    @Schema(description = "${col.comment.replace(/"/g, '\\"')}")`);
      } else {
        lines.push(`    @ApiModelProperty(value = "${col.comment.replace(/"/g, '\\"')}")`);
      }
    }
    if (opts.jpa) {
      if (col.isPrimary) {
        lines.push("    @Id");
        lines.push("    @GeneratedValue(strategy = GenerationType.IDENTITY)");
      }
      lines.push(`    @Column(name = "${col.name}"${col.nullable ? "" : ", nullable = false"})`);
    }
    if (opts.mybatis) {
      if (col.isPrimary) lines.push("    @TableId(type = IdType.AUTO)");
      else lines.push(`    @TableField("${col.name}")`);
    }
    lines.push(`    private ${col.type} ${fieldName};`);
  }

  if (!opts.lombok) {
    lines.push("");
    for (const col of columns) {
      const fieldName = snakeToCamel(col.name);
      const cap = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      lines.push(`    public ${col.type} get${cap}() {`);
      lines.push(`        return ${fieldName};`);
      lines.push("    }");
      lines.push("");
      lines.push(`    public void set${cap}(${col.type} ${fieldName}) {`);
      lines.push(`        this.${fieldName} = ${fieldName};`);
      lines.push("    }");
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
  const [springBoot3, setSpringBoot3] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    setError("");
    if (!sql.trim()) { setError("请输入 SQL 建表语句"); return; }
    try {
      const { tableName, tableComment, columns } = parseSql(sql);
      if (!tableName || columns.length === 0) {
        setError("无法解析表名或列，请检查 SQL 格式");
        return;
      }
      const code = generateJava(tableName, tableComment, columns, {
        lombok, jpa, mybatis, swagger, serializable, springBoot3,
      });
      setOutput(code);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [sql, lombok, jpa, mybatis, swagger, serializable, springBoot3]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">SQL 转 Java 实体类</h1>
      <p className="page-subtitle">粘贴 SQL 建表语句，自动生成 Java 实体类，支持 Spring Boot 2/3、Lombok、JPA、MyBatis-Plus</p>

      <div className="card mt-6 rounded-xl p-4">
        {/* Spring Boot version toggle */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-[var(--background)] p-3">
          <span className="text-sm font-medium">Spring Boot 版本：</span>
          <button
            onClick={() => setSpringBoot3(false)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!springBoot3 ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-[var(--primary)]"}`}
          >
            Boot 2.x (javax)
          </button>
          <button
            onClick={() => setSpringBoot3(true)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${springBoot3 ? "bg-[var(--primary)] text-white" : "border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-[var(--primary)]"}`}
          >
            Boot 3.x (jakarta)
          </button>
        </div>

        {/* Annotation options */}
        <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
          {[
            { label: "Lombok @Data", checked: lombok, set: setLombok },
            { label: "JPA 注解", checked: jpa, set: setJpa },
            { label: "MyBatis-Plus", checked: mybatis, set: setMybatis },
            { label: springBoot3 ? "Swagger v3 @Schema" : "Swagger @ApiModelProperty", checked: swagger, set: setSwagger },
            { label: "Serializable", checked: serializable, set: setSerializable },
          ].map((opt) => (
            <label key={opt.label} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="rounded" />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={generate} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
            生成 Java 实体类
          </button>
          <button onClick={() => setSql(SAMPLE_SQL)} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
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
              className="textarea-tool h-96 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">生成的 Java 代码</label>
            <pre className="textarea-tool h-96 w-full overflow-auto rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
              {output || "点击「生成 Java 实体类」查看结果"}
            </pre>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-lg bg-[var(--background)] p-4 text-xs text-[var(--muted)]">
          <p className="mb-1 font-medium text-[var(--foreground)]">版本差异说明</p>
          <ul className="ml-4 list-disc space-y-0.5">
            <li><b>Spring Boot 3.x</b>：JPA 使用 <code>jakarta.persistence.*</code>，Swagger 使用 <code>@Schema</code>（SpringDoc OpenAPI 3）</li>
            <li><b>Spring Boot 2.x</b>：JPA 使用 <code>javax.persistence.*</code>，Swagger 使用 <code>@ApiModelProperty</code>（SpringFox）</li>
            <li>支持 DECIMAL、ENUM、TEXT、BLOB、JSON 等全部 MySQL 类型映射</li>
          </ul>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
