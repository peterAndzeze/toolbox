"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = [
  "数据库操作", "表操作", "增删改查", "条件与排序", "聚合函数",
  "连接查询", "索引与约束", "常用函数", "用户与权限",
  "窗口函数", "CTE 公用表表达式", "JSON 操作",
];

const items: CheatItem[] = [
  // ── 数据库操作 ──
  {
    category: "数据库操作", title: "创建数据库",
    description: "创建新数据库，可指定字符集",
    code: "CREATE DATABASE mydb\n  DEFAULT CHARACTER SET utf8mb4\n  DEFAULT COLLATE utf8mb4_unicode_ci;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-database.html",
  },
  {
    category: "数据库操作", title: "删除数据库",
    description: "删除整个数据库及其所有表",
    code: "DROP DATABASE IF EXISTS mydb;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/drop-database.html",
  },
  {
    category: "数据库操作", title: "查看所有数据库",
    description: "列出服务器上的所有数据库",
    code: "SHOW DATABASES;",
  },
  {
    category: "数据库操作", title: "切换数据库",
    description: "选择要使用的数据库",
    code: "USE mydb;",
  },
  {
    category: "数据库操作", title: "查看数据库信息",
    description: "查看数据库创建语句和字符集",
    code: "SHOW CREATE DATABASE mydb;",
  },

  // ── 表操作 ──
  {
    category: "表操作", title: "创建表",
    description: "创建新表，定义字段和主键",
    code: "CREATE TABLE users (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE,\n  age INT DEFAULT 0,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-table.html",
  },
  {
    category: "表操作", title: "查看表结构",
    description: "显示表的字段定义",
    code: "DESC users;\n-- 或\nSHOW COLUMNS FROM users;",
  },
  {
    category: "表操作", title: "添加字段",
    description: "给表新增一个字段",
    code: "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/alter-table.html",
  },
  {
    category: "表操作", title: "修改字段",
    description: "修改字段类型或名称",
    code: "-- 修改类型\nALTER TABLE users MODIFY COLUMN name VARCHAR(200);\n-- 改名\nALTER TABLE users CHANGE COLUMN name username VARCHAR(200);",
  },
  {
    category: "表操作", title: "删除字段",
    description: "从表中移除一个字段",
    code: "ALTER TABLE users DROP COLUMN phone;",
  },
  {
    category: "表操作", title: "删除表",
    description: "删除整个表",
    code: "DROP TABLE IF EXISTS users;",
  },
  {
    category: "表操作", title: "清空表数据",
    description: "删除所有数据但保留表结构",
    code: "TRUNCATE TABLE users;",
  },
  {
    category: "表操作", title: "重命名表",
    description: "修改表名",
    code: "RENAME TABLE users TO members;",
  },

  // ── 增删改查 ──
  {
    category: "增删改查", title: "插入数据",
    description: "向表中插入新记录",
    code: "INSERT INTO users (name, email, age)\nVALUES ('张三', 'zhang@example.com', 25);",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/insert.html",
  },
  {
    category: "增删改查", title: "批量插入",
    description: "一次插入多条记录",
    code: "INSERT INTO users (name, email, age) VALUES\n  ('张三', 'zhang@example.com', 25),\n  ('李四', 'li@example.com', 30),\n  ('王五', 'wang@example.com', 28);",
  },
  {
    category: "增删改查", title: "查询数据",
    description: "从表中查询记录",
    code: "SELECT id, name, email FROM users\nWHERE age > 18\nORDER BY created_at DESC\nLIMIT 10;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/select.html",
  },
  {
    category: "增删改查", title: "查询所有字段",
    description: "查询表中所有字段",
    code: "SELECT * FROM users;",
  },
  {
    category: "增删改查", title: "更新数据",
    description: "修改已有记录",
    code: "UPDATE users\nSET name = '张三丰', age = 30\nWHERE id = 1;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/update.html",
  },
  {
    category: "增删改查", title: "删除数据",
    description: "删除符合条件的记录",
    code: "DELETE FROM users WHERE id = 1;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/delete.html",
  },
  {
    category: "增删改查", title: "插入或更新",
    description: "存在则更新，不存在则插入",
    code: "INSERT INTO users (id, name, email)\nVALUES (1, '张三', 'zhang@example.com')\nON DUPLICATE KEY UPDATE\n  name = VALUES(name),\n  email = VALUES(email);",
  },

  // ── 条件与排序 ──
  {
    category: "条件与排序", title: "WHERE 条件",
    description: "常用查询条件",
    code: "-- 等于\nWHERE name = '张三'\n-- 不等于\nWHERE age != 18\n-- 范围\nWHERE age BETWEEN 18 AND 30\n-- 包含\nWHERE id IN (1, 2, 3)\n-- 模糊匹配\nWHERE name LIKE '张%'\n-- 空值判断\nWHERE email IS NOT NULL",
  },
  {
    category: "条件与排序", title: "排序",
    description: "按字段排序",
    code: "-- 升序（默认）\nORDER BY age ASC\n-- 降序\nORDER BY created_at DESC\n-- 多字段排序\nORDER BY age DESC, name ASC",
  },
  {
    category: "条件与排序", title: "分页查询",
    description: "LIMIT 和 OFFSET 分页",
    code: "-- 第1页（每页10条）\nSELECT * FROM users LIMIT 10 OFFSET 0;\n-- 第2页\nSELECT * FROM users LIMIT 10 OFFSET 10;\n-- 简写\nSELECT * FROM users LIMIT 10, 10;",
  },
  {
    category: "条件与排序", title: "去重查询",
    description: "查询不重复的值",
    code: "SELECT DISTINCT city FROM users;",
  },

  // ── 聚合函数 ──
  {
    category: "聚合函数", title: "COUNT 计数",
    description: "统计记录数量",
    code: "SELECT COUNT(*) AS total FROM users;\nSELECT COUNT(DISTINCT city) AS city_count FROM users;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html",
  },
  {
    category: "聚合函数", title: "SUM / AVG",
    description: "求和与平均值",
    code: "SELECT SUM(amount) AS total, AVG(amount) AS avg_amount\nFROM orders;",
  },
  {
    category: "聚合函数", title: "MAX / MIN",
    description: "最大值与最小值",
    code: "SELECT MAX(age) AS oldest, MIN(age) AS youngest\nFROM users;",
  },
  {
    category: "聚合函数", title: "GROUP BY 分组",
    description: "按字段分组统计",
    code: "SELECT city, COUNT(*) AS user_count\nFROM users\nGROUP BY city\nHAVING COUNT(*) > 10\nORDER BY user_count DESC;",
  },

  // ── 连接查询 ──
  {
    category: "连接查询", title: "INNER JOIN",
    description: "内连接，返回两表匹配的记录",
    code: "SELECT u.name, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/join.html",
  },
  {
    category: "连接查询", title: "LEFT JOIN",
    description: "左连接，返回左表所有记录",
    code: "SELECT u.name, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;",
  },
  {
    category: "连接查询", title: "子查询",
    description: "嵌套查询",
    code: "SELECT * FROM users\nWHERE id IN (\n  SELECT user_id FROM orders\n  WHERE amount > 1000\n);",
  },
  {
    category: "连接查询", title: "多表连接",
    description: "三个表以上的连接",
    code: "SELECT u.name, o.id, p.product_name\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN products p ON o.product_id = p.id\nWHERE o.status = 'completed';",
  },

  // ── 索引与约束 ──
  {
    category: "索引与约束", title: "创建索引",
    description: "为字段创建索引提升查询速度",
    code: "-- 普通索引\nCREATE INDEX idx_name ON users(name);\n-- 唯一索引\nCREATE UNIQUE INDEX idx_email ON users(email);\n-- 联合索引\nCREATE INDEX idx_name_age ON users(name, age);",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-index.html",
  },
  {
    category: "索引与约束", title: "查看索引",
    description: "查看表的索引信息",
    code: "SHOW INDEX FROM users;",
  },
  {
    category: "索引与约束", title: "删除索引",
    description: "移除索引",
    code: "DROP INDEX idx_name ON users;",
  },
  {
    category: "索引与约束", title: "外键约束",
    description: "创建外键关联",
    code: "ALTER TABLE orders\nADD CONSTRAINT fk_user\nFOREIGN KEY (user_id) REFERENCES users(id)\nON DELETE CASCADE;",
  },
  {
    category: "索引与约束", title: "不可见索引",
    description: "将索引设为不可见，优化器不使用但保留索引数据，方便测试删除索引的影响",
    code: "-- 创建不可见索引\nALTER TABLE users ALTER INDEX idx_name INVISIBLE;\n-- 恢复可见\nALTER TABLE users ALTER INDEX idx_name VISIBLE;\n-- 查看索引可见性\nSELECT INDEX_NAME, IS_VISIBLE\nFROM INFORMATION_SCHEMA.STATISTICS\nWHERE TABLE_NAME = 'users';",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/invisible-indexes.html",
  },
  {
    category: "索引与约束", title: "CHECK 约束",
    description: "8.0.16 起真正强制执行 CHECK 约束（5.7 仅解析不执行）",
    code: "CREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name VARCHAR(100),\n  price DECIMAL(10,2),\n  CONSTRAINT chk_price CHECK (price > 0)\n);\n\nALTER TABLE users\nADD CONSTRAINT chk_age CHECK (age >= 0 AND age <= 200);",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html",
  },

  // ── 常用函数 ──
  {
    category: "常用函数", title: "字符串函数",
    description: "常用字符串操作",
    code: "SELECT\n  CONCAT(first_name, ' ', last_name) AS full_name,\n  UPPER(name) AS upper_name,\n  LOWER(name) AS lower_name,\n  LENGTH(name) AS name_len,\n  SUBSTRING(name, 1, 3) AS short_name,\n  REPLACE(email, '@', '[at]') AS safe_email,\n  TRIM('  hello  ') AS trimmed\nFROM users;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/string-functions.html",
  },
  {
    category: "常用函数", title: "日期函数",
    description: "日期和时间处理",
    code: "SELECT\n  NOW() AS current_time,\n  CURDATE() AS today,\n  DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted,\n  DATEDIFF(NOW(), created_at) AS days_ago,\n  DATE_ADD(NOW(), INTERVAL 7 DAY) AS next_week,\n  YEAR(created_at) AS year,\n  MONTH(created_at) AS month\nFROM users;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html",
  },
  {
    category: "常用函数", title: "条件函数",
    description: "IF 和 CASE 条件判断",
    code: "SELECT name,\n  IF(age >= 18, '成年', '未成年') AS status,\n  CASE\n    WHEN age < 18 THEN '少年'\n    WHEN age < 40 THEN '青年'\n    WHEN age < 60 THEN '中年'\n    ELSE '老年'\n  END AS age_group\nFROM users;",
  },
  {
    category: "常用函数", title: "类型转换",
    description: "数据类型转换",
    code: "SELECT\n  CAST('123' AS SIGNED) AS int_val,\n  CAST(price AS CHAR) AS str_val,\n  CONVERT('2024-01-01', DATE) AS date_val;",
  },

  // ── 用户与权限 ──
  {
    category: "用户与权限", title: "创建用户",
    description: "创建新的数据库用户",
    code: "CREATE USER 'appuser'@'%'\nIDENTIFIED BY 'StrongPassword123!';",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-user.html",
  },
  {
    category: "用户与权限", title: "授权",
    description: "给用户分配权限",
    code: "-- 给予特定数据库所有权限\nGRANT ALL PRIVILEGES ON mydb.* TO 'appuser'@'%';\n-- 只给查询权限\nGRANT SELECT ON mydb.* TO 'readonly'@'%';\n-- 刷新权限\nFLUSH PRIVILEGES;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/grant.html",
  },
  {
    category: "用户与权限", title: "撤销权限",
    description: "收回用户权限",
    code: "REVOKE ALL PRIVILEGES ON mydb.* FROM 'appuser'@'%';",
  },
  {
    category: "用户与权限", title: "查看权限",
    description: "查看用户的权限",
    code: "SHOW GRANTS FOR 'appuser'@'%';",
  },
  {
    category: "用户与权限", title: "角色管理",
    description: "8.0 起支持 SQL 角色，批量管理权限",
    code: "-- 创建角色\nCREATE ROLE 'app_read', 'app_write';\n-- 给角色授权\nGRANT SELECT ON mydb.* TO 'app_read';\nGRANT INSERT, UPDATE, DELETE ON mydb.* TO 'app_write';\n-- 将角色赋予用户\nGRANT 'app_read', 'app_write' TO 'appuser'@'%';\n-- 激活角色\nSET DEFAULT ROLE ALL TO 'appuser'@'%';",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/roles.html",
  },

  // ── 窗口函数（8.0+）──
  {
    category: "窗口函数", title: "ROW_NUMBER",
    description: "为结果集中的每一行分配唯一的行号",
    code: "SELECT\n  name, department, salary,\n  ROW_NUMBER() OVER (\n    PARTITION BY department\n    ORDER BY salary DESC\n  ) AS rn\nFROM employees;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html#function_row-number",
  },
  {
    category: "窗口函数", title: "RANK / DENSE_RANK",
    description: "排名函数，RANK 有间隔，DENSE_RANK 无间隔",
    code: "SELECT name, score,\n  RANK() OVER (ORDER BY score DESC) AS rank_with_gap,\n  DENSE_RANK() OVER (ORDER BY score DESC) AS rank_no_gap\nFROM students;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html#function_rank",
  },
  {
    category: "窗口函数", title: "LAG / LEAD",
    description: "访问当前行前后的行数据，常用于同比/环比",
    code: "SELECT\n  month, revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,\n  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS growth\nFROM monthly_sales;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html#function_lag",
  },
  {
    category: "窗口函数", title: "SUM / AVG OVER",
    description: "窗口聚合：累计求和、移动平均等",
    code: "SELECT\n  order_date, amount,\n  SUM(amount) OVER (ORDER BY order_date) AS running_total,\n  AVG(amount) OVER (\n    ORDER BY order_date\n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS moving_avg_7d\nFROM orders;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-functions-usage.html",
  },
  {
    category: "窗口函数", title: "NTILE",
    description: "将结果集均匀分成 N 个桶",
    code: "SELECT name, salary,\n  NTILE(4) OVER (ORDER BY salary DESC) AS quartile\nFROM employees;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html#function_ntile",
  },

  // ── CTE 公用表表达式（8.0+）──
  {
    category: "CTE 公用表表达式", title: "基本 CTE",
    description: "WITH 子句定义临时结果集，提升可读性",
    code: "WITH active_users AS (\n  SELECT * FROM users\n  WHERE status = 'active'\n    AND last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)\n)\nSELECT department, COUNT(*) AS cnt\nFROM active_users\nGROUP BY department;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/with.html",
  },
  {
    category: "CTE 公用表表达式", title: "多 CTE 组合",
    description: "一次定义多个 CTE 并关联使用",
    code: "WITH\n  dept_stats AS (\n    SELECT department_id, AVG(salary) AS avg_sal\n    FROM employees GROUP BY department_id\n  ),\n  high_earners AS (\n    SELECT e.*, d.avg_sal\n    FROM employees e\n    JOIN dept_stats d ON e.department_id = d.department_id\n    WHERE e.salary > d.avg_sal * 1.5\n  )\nSELECT * FROM high_earners ORDER BY salary DESC;",
    addedIn: "8.0",
  },
  {
    category: "CTE 公用表表达式", title: "递归 CTE",
    description: "递归查询，适合处理层级/树形结构数据",
    code: "WITH RECURSIVE org_tree AS (\n  -- 锚定成员：找到根节点\n  SELECT id, name, manager_id, 1 AS level\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  -- 递归成员：逐层展开\n  SELECT e.id, e.name, e.manager_id, t.level + 1\n  FROM employees e\n  JOIN org_tree t ON e.manager_id = t.id\n)\nSELECT * FROM org_tree ORDER BY level, name;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-recursive",
  },

  // ── JSON 操作（5.7 基础，8.0 增强）──
  {
    category: "JSON 操作", title: "JSON 列与基本操作",
    description: "创建 JSON 类型列，存取 JSON 数据",
    code: "CREATE TABLE events (\n  id BIGINT PRIMARY KEY,\n  data JSON NOT NULL\n);\n\nINSERT INTO events VALUES\n  (1, '{\"type\": \"click\", \"page\": \"/home\"}');\n\n-- 提取值\nSELECT\n  data->>'$.type' AS event_type,\n  data->>'$.page' AS page\nFROM events;",
    addedIn: "5.7",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/json.html",
  },
  {
    category: "JSON 操作", title: "JSON 查询函数",
    description: "JSON_EXTRACT, JSON_CONTAINS 等查询函数",
    code: "-- 提取\nSELECT JSON_EXTRACT(data, '$.tags[0]') FROM events;\n-- ->> 是 JSON_UNQUOTE(JSON_EXTRACT(...)) 的简写\nSELECT data->>'$.name' FROM events;\n-- 包含判断\nSELECT * FROM events\nWHERE JSON_CONTAINS(data, '\"click\"', '$.type');\n-- 键是否存在\nSELECT * FROM events\nWHERE JSON_CONTAINS_PATH(data, 'one', '$.email');",
    addedIn: "5.7",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html",
  },
  {
    category: "JSON 操作", title: "JSON 修改函数",
    description: "JSON_SET, JSON_INSERT, JSON_REMOVE 等修改函数",
    code: "-- 设置（存在则覆盖，不存在则新增）\nUPDATE events SET data = JSON_SET(data, '$.status', 'done');\n-- 插入（仅不存在时新增）\nUPDATE events SET data = JSON_INSERT(data, '$.priority', 'high');\n-- 删除\nUPDATE events SET data = JSON_REMOVE(data, '$.temp');\n-- 数组追加\nUPDATE events SET data = JSON_ARRAY_APPEND(data, '$.tags', 'new');",
    addedIn: "5.7",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html",
  },
  {
    category: "JSON 操作", title: "JSON_TABLE",
    description: "将 JSON 数据展开为关系表行列，便于 JOIN 和聚合",
    code: "SELECT jt.*\nFROM events,\n  JSON_TABLE(\n    data, '$.items[*]' COLUMNS (\n      item_id INT PATH '$.id',\n      item_name VARCHAR(100) PATH '$.name',\n      quantity INT PATH '$.qty' DEFAULT '0' ON EMPTY\n    )\n  ) AS jt\nWHERE jt.quantity > 0;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/json-table-functions.html",
  },
  {
    category: "JSON 操作", title: "JSON Schema 校验",
    description: "使用 JSON_SCHEMA_VALID 在插入时校验 JSON 格式",
    code: "ALTER TABLE events ADD CONSTRAINT chk_data\n  CHECK (JSON_SCHEMA_VALID('{\n    \"type\": \"object\",\n    \"required\": [\"type\", \"page\"],\n    \"properties\": {\n      \"type\": {\"type\": \"string\"},\n      \"page\": {\"type\": \"string\"}\n    }\n  }', data));",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/json-validation-functions.html",
  },
];

export default function MySQLCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="MySQL 速查手册"
        subtitle="MySQL 常用语句、函数、操作速查，支持按版本筛选、搜索和一键复制"
        items={items}
        categories={categories}
        versions={["5.7", "8.0", "8.4"]}
        defaultVersion="8.4"
      />
    </ToolPageWrapper>
  );
}
