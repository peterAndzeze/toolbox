"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["数据库操作", "表操作", "增删改查", "条件与排序", "聚合函数", "连接查询", "索引与约束", "常用函数", "用户与权限"];

const items: CheatItem[] = [
  // 数据库操作
  { category: "数据库操作", title: "创建数据库", description: "创建新数据库，可指定字符集", code: "CREATE DATABASE mydb\n  DEFAULT CHARACTER SET utf8mb4\n  DEFAULT COLLATE utf8mb4_unicode_ci;" },
  { category: "数据库操作", title: "删除数据库", description: "删除整个数据库及其所有表", code: "DROP DATABASE IF EXISTS mydb;" },
  { category: "数据库操作", title: "查看所有数据库", description: "列出服务器上的所有数据库", code: "SHOW DATABASES;" },
  { category: "数据库操作", title: "切换数据库", description: "选择要使用的数据库", code: "USE mydb;" },
  { category: "数据库操作", title: "查看数据库信息", description: "查看数据库创建语句和字符集", code: "SHOW CREATE DATABASE mydb;" },

  // 表操作
  { category: "表操作", title: "创建表", description: "创建新表，定义字段和主键", code: "CREATE TABLE users (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE,\n  age INT DEFAULT 0,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;" },
  { category: "表操作", title: "查看表结构", description: "显示表的字段定义", code: "DESC users;\n-- 或\nSHOW COLUMNS FROM users;" },
  { category: "表操作", title: "添加字段", description: "给表新增一个字段", code: "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;" },
  { category: "表操作", title: "修改字段", description: "修改字段类型或名称", code: "-- 修改类型\nALTER TABLE users MODIFY COLUMN name VARCHAR(200);\n-- 改名\nALTER TABLE users CHANGE COLUMN name username VARCHAR(200);" },
  { category: "表操作", title: "删除字段", description: "从表中移除一个字段", code: "ALTER TABLE users DROP COLUMN phone;" },
  { category: "表操作", title: "删除表", description: "删除整个表", code: "DROP TABLE IF EXISTS users;" },
  { category: "表操作", title: "清空表数据", description: "删除所有数据但保留表结构", code: "TRUNCATE TABLE users;" },
  { category: "表操作", title: "重命名表", description: "修改表名", code: "RENAME TABLE users TO members;" },

  // 增删改查
  { category: "增删改查", title: "插入数据", description: "向表中插入新记录", code: "INSERT INTO users (name, email, age)\nVALUES ('张三', 'zhang@example.com', 25);" },
  { category: "增删改查", title: "批量插入", description: "一次插入多条记录", code: "INSERT INTO users (name, email, age) VALUES\n  ('张三', 'zhang@example.com', 25),\n  ('李四', 'li@example.com', 30),\n  ('王五', 'wang@example.com', 28);" },
  { category: "增删改查", title: "查询数据", description: "从表中查询记录", code: "SELECT id, name, email FROM users\nWHERE age > 18\nORDER BY created_at DESC\nLIMIT 10;" },
  { category: "增删改查", title: "查询所有字段", description: "查询表中所有字段", code: "SELECT * FROM users;" },
  { category: "增删改查", title: "更新数据", description: "修改已有记录", code: "UPDATE users\nSET name = '张三丰', age = 30\nWHERE id = 1;" },
  { category: "增删改查", title: "删除数据", description: "删除符合条件的记录", code: "DELETE FROM users WHERE id = 1;" },
  { category: "增删改查", title: "插入或更新", description: "存在则更新，不存在则插入", code: "INSERT INTO users (id, name, email)\nVALUES (1, '张三', 'zhang@example.com')\nON DUPLICATE KEY UPDATE\n  name = VALUES(name),\n  email = VALUES(email);" },

  // 条件与排序
  { category: "条件与排序", title: "WHERE 条件", description: "常用查询条件", code: "-- 等于\nWHERE name = '张三'\n-- 不等于\nWHERE age != 18\n-- 范围\nWHERE age BETWEEN 18 AND 30\n-- 包含\nWHERE id IN (1, 2, 3)\n-- 模糊匹配\nWHERE name LIKE '张%'\n-- 空值判断\nWHERE email IS NOT NULL" },
  { category: "条件与排序", title: "排序", description: "按字段排序", code: "-- 升序（默认）\nORDER BY age ASC\n-- 降序\nORDER BY created_at DESC\n-- 多字段排序\nORDER BY age DESC, name ASC" },
  { category: "条件与排序", title: "分页查询", description: "LIMIT 和 OFFSET 分页", code: "-- 第1页（每页10条）\nSELECT * FROM users LIMIT 10 OFFSET 0;\n-- 第2页\nSELECT * FROM users LIMIT 10 OFFSET 10;\n-- 简写\nSELECT * FROM users LIMIT 10, 10;" },
  { category: "条件与排序", title: "去重查询", description: "查询不重复的值", code: "SELECT DISTINCT city FROM users;" },

  // 聚合函数
  { category: "聚合函数", title: "COUNT 计数", description: "统计记录数量", code: "SELECT COUNT(*) AS total FROM users;\nSELECT COUNT(DISTINCT city) AS city_count FROM users;" },
  { category: "聚合函数", title: "SUM / AVG", description: "求和与平均值", code: "SELECT SUM(amount) AS total, AVG(amount) AS avg_amount\nFROM orders;" },
  { category: "聚合函数", title: "MAX / MIN", description: "最大值与最小值", code: "SELECT MAX(age) AS oldest, MIN(age) AS youngest\nFROM users;" },
  { category: "聚合函数", title: "GROUP BY 分组", description: "按字段分组统计", code: "SELECT city, COUNT(*) AS user_count\nFROM users\nGROUP BY city\nHAVING COUNT(*) > 10\nORDER BY user_count DESC;" },

  // 连接查询
  { category: "连接查询", title: "INNER JOIN", description: "内连接，返回两表匹配的记录", code: "SELECT u.name, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;" },
  { category: "连接查询", title: "LEFT JOIN", description: "左连接，返回左表所有记录", code: "SELECT u.name, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;" },
  { category: "连接查询", title: "子查询", description: "嵌套查询", code: "SELECT * FROM users\nWHERE id IN (\n  SELECT user_id FROM orders\n  WHERE amount > 1000\n);" },
  { category: "连接查询", title: "多表连接", description: "三个表以上的连接", code: "SELECT u.name, o.id, p.product_name\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN products p ON o.product_id = p.id\nWHERE o.status = 'completed';" },

  // 索引与约束
  { category: "索引与约束", title: "创建索引", description: "为字段创建索引提升查询速度", code: "-- 普通索引\nCREATE INDEX idx_name ON users(name);\n-- 唯一索引\nCREATE UNIQUE INDEX idx_email ON users(email);\n-- 联合索引\nCREATE INDEX idx_name_age ON users(name, age);" },
  { category: "索引与约束", title: "查看索引", description: "查看表的索引信息", code: "SHOW INDEX FROM users;" },
  { category: "索引与约束", title: "删除索引", description: "移除索引", code: "DROP INDEX idx_name ON users;" },
  { category: "索引与约束", title: "外键约束", description: "创建外键关联", code: "ALTER TABLE orders\nADD CONSTRAINT fk_user\nFOREIGN KEY (user_id) REFERENCES users(id)\nON DELETE CASCADE;" },

  // 常用函数
  { category: "常用函数", title: "字符串函数", description: "常用字符串操作", code: "SELECT\n  CONCAT(first_name, ' ', last_name) AS full_name,\n  UPPER(name) AS upper_name,\n  LOWER(name) AS lower_name,\n  LENGTH(name) AS name_len,\n  SUBSTRING(name, 1, 3) AS short_name,\n  REPLACE(email, '@', '[at]') AS safe_email,\n  TRIM('  hello  ') AS trimmed\nFROM users;" },
  { category: "常用函数", title: "日期函数", description: "日期和时间处理", code: "SELECT\n  NOW() AS current_time,\n  CURDATE() AS today,\n  DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted,\n  DATEDIFF(NOW(), created_at) AS days_ago,\n  DATE_ADD(NOW(), INTERVAL 7 DAY) AS next_week,\n  YEAR(created_at) AS year,\n  MONTH(created_at) AS month\nFROM users;" },
  { category: "常用函数", title: "条件函数", description: "IF 和 CASE 条件判断", code: "SELECT name,\n  IF(age >= 18, '成年', '未成年') AS status,\n  CASE\n    WHEN age < 18 THEN '少年'\n    WHEN age < 40 THEN '青年'\n    WHEN age < 60 THEN '中年'\n    ELSE '老年'\n  END AS age_group\nFROM users;" },
  { category: "常用函数", title: "类型转换", description: "数据类型转换", code: "SELECT\n  CAST('123' AS SIGNED) AS int_val,\n  CAST(price AS CHAR) AS str_val,\n  CONVERT('2024-01-01', DATE) AS date_val;" },

  // 用户与权限
  { category: "用户与权限", title: "创建用户", description: "创建新的数据库用户", code: "CREATE USER 'appuser'@'%'\nIDENTIFIED BY 'StrongPassword123!';" },
  { category: "用户与权限", title: "授权", description: "给用户分配权限", code: "-- 给予特定数据库所有权限\nGRANT ALL PRIVILEGES ON mydb.* TO 'appuser'@'%';\n-- 只给查询权限\nGRANT SELECT ON mydb.* TO 'readonly'@'%';\n-- 刷新权限\nFLUSH PRIVILEGES;" },
  { category: "用户与权限", title: "撤销权限", description: "收回用户权限", code: "REVOKE ALL PRIVILEGES ON mydb.* FROM 'appuser'@'%';" },
  { category: "用户与权限", title: "查看权限", description: "查看用户的权限", code: "SHOW GRANTS FOR 'appuser'@'%';" },
];

export default function MySQLCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="MySQL 速查手册"
        subtitle="MySQL 常用语句、函数、操作速查，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
