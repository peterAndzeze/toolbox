"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = [
  "数据库操作", "表操作", "增删改查", "条件与排序", "聚合函数",
  "连接查询", "索引与约束", "常用函数", "用户与权限",
  "事务管理", "视图", "存储过程与函数", "备份与恢复", "性能优化",
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
    description: "创建新的数据库用户，可指定主机和认证方式",
    code: "-- 允许任意主机连接\nCREATE USER 'appuser'@'%'\nIDENTIFIED BY 'StrongPassword123!';\n-- 仅允许本地连接\nCREATE USER 'localuser'@'localhost'\nIDENTIFIED BY 'Password456!';\n-- 仅允许指定 IP\nCREATE USER 'remote'@'192.168.1.%'\nIDENTIFIED BY 'Password789!';",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-user.html",
  },
  {
    category: "用户与权限", title: "查看所有用户",
    description: "列出服务器上的所有用户账号",
    code: "-- 查看用户列表\nSELECT User, Host, authentication_string\nFROM mysql.user;\n-- 查看当前用户\nSELECT CURRENT_USER();\n-- 查看所有用户及最近登录\nSELECT User, Host, account_locked, password_expired\nFROM mysql.user;",
  },
  {
    category: "用户与权限", title: "授权整个数据库",
    description: "给用户授权某个数据库的所有权限",
    code: "-- 所有权限（增删改查+结构操作）\nGRANT ALL PRIVILEGES ON mydb.* TO 'appuser'@'%';\n-- 只给 CRUD 权限\nGRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'appuser'@'%';\n-- 给所有数据库的查询权限\nGRANT SELECT ON *.* TO 'readonly'@'%';\n-- 刷新权限\nFLUSH PRIVILEGES;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/grant.html",
  },
  {
    category: "用户与权限", title: "授权指定表",
    description: "精细化授权到表级别",
    code: "-- 只授权某张表的查询\nGRANT SELECT ON mydb.users TO 'appuser'@'%';\n-- 多张表分别授权\nGRANT SELECT, INSERT ON mydb.orders TO 'appuser'@'%';\nGRANT SELECT ON mydb.products TO 'appuser'@'%';\n-- 授权表的增删改查\nGRANT SELECT, INSERT, UPDATE, DELETE\nON mydb.users TO 'appuser'@'%';",
  },
  {
    category: "用户与权限", title: "授权指定列",
    description: "精细化授权到列级别，限制用户只能操作特定字段",
    code: "-- 只允许查看 name 和 email 列\nGRANT SELECT (name, email) ON mydb.users TO 'appuser'@'%';\n-- 只允许更新 email 列\nGRANT UPDATE (email) ON mydb.users TO 'appuser'@'%';\n-- 只允许插入指定列\nGRANT INSERT (name, email) ON mydb.users TO 'appuser'@'%';",
  },
  {
    category: "用户与权限", title: "权限类型详解",
    description: "MySQL 常用权限类型列表",
    code: "-- 数据操作权限\n-- SELECT    查询数据\n-- INSERT    插入数据\n-- UPDATE    更新数据\n-- DELETE    删除数据\n\n-- 结构操作权限\n-- CREATE    创建数据库/表\n-- ALTER     修改表结构\n-- DROP      删除数据库/表\n-- INDEX     创建/删除索引\n-- REFERENCES 创建外键\n\n-- 管理权限\n-- GRANT OPTION   可将自己的权限授予他人\n-- PROCESS        查看所有进程\n-- RELOAD         执行 FLUSH\n-- SUPER          杀掉其他用户进程\n-- CREATE USER    创建/删除用户\n-- SHOW DATABASES 查看所有数据库",
  },
  {
    category: "用户与权限", title: "撤销权限",
    description: "收回用户权限",
    code: "-- 撤销数据库级别权限\nREVOKE ALL PRIVILEGES ON mydb.* FROM 'appuser'@'%';\n-- 撤销特定表权限\nREVOKE SELECT ON mydb.users FROM 'appuser'@'%';\n-- 撤销全局权限\nREVOKE ALL PRIVILEGES, GRANT OPTION FROM 'appuser'@'%';",
  },
  {
    category: "用户与权限", title: "查看权限",
    description: "查看用户的权限详情",
    code: "-- 查看指定用户权限\nSHOW GRANTS FOR 'appuser'@'%';\n-- 查看当前用户权限\nSHOW GRANTS;\n-- 从系统表查看库级权限\nSELECT * FROM mysql.db WHERE User = 'appuser';\n-- 查看表级权限\nSELECT * FROM mysql.tables_priv WHERE User = 'appuser';\n-- 查看列级权限\nSELECT * FROM mysql.columns_priv WHERE User = 'appuser';",
  },
  {
    category: "用户与权限", title: "修改密码",
    description: "修改用户密码",
    code: "-- 8.0 推荐方式\nALTER USER 'appuser'@'%'\nIDENTIFIED BY 'NewPassword456!';\n-- 修改当前用户密码\nSET PASSWORD = 'NewPassword456!';\n-- 密码过期，强制用户下次登录修改\nALTER USER 'appuser'@'%' PASSWORD EXPIRE;",
  },
  {
    category: "用户与权限", title: "删除用户与锁定",
    description: "删除用户或锁定/解锁账户",
    code: "-- 删除用户\nDROP USER 'appuser'@'%';\nDROP USER IF EXISTS 'tempuser'@'%';\n-- 锁定账户（禁止登录）\nALTER USER 'appuser'@'%' ACCOUNT LOCK;\n-- 解锁账户\nALTER USER 'appuser'@'%' ACCOUNT UNLOCK;",
  },
  {
    category: "用户与权限", title: "角色管理",
    description: "8.0 起支持 SQL 角色，批量管理权限",
    code: "-- 创建角色\nCREATE ROLE 'app_read', 'app_write';\n-- 给角色授权\nGRANT SELECT ON mydb.* TO 'app_read';\nGRANT INSERT, UPDATE, DELETE ON mydb.* TO 'app_write';\n-- 将角色赋予用户\nGRANT 'app_read', 'app_write' TO 'appuser'@'%';\n-- 激活角色\nSET DEFAULT ROLE ALL TO 'appuser'@'%';\n-- 查看角色\nSELECT * FROM mysql.role_edges;",
    addedIn: "8.0",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/roles.html",
  },

  // ── 事务管理 ──
  {
    category: "事务管理", title: "基本事务",
    description: "BEGIN/COMMIT/ROLLBACK 控制事务",
    code: "START TRANSACTION;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- 一切正常则提交\nCOMMIT;\n-- 出错则回滚\n-- ROLLBACK;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/commit.html",
  },
  {
    category: "事务管理", title: "SAVEPOINT 保存点",
    description: "在事务中设置回滚点，可以部分回滚",
    code: "START TRANSACTION;\n\nINSERT INTO orders (user_id, amount) VALUES (1, 500);\nSAVEPOINT sp_order;\n\nINSERT INTO order_items (order_id, product_id) VALUES (100, 5);\n-- 这一步出错，只回滚到保存点\nROLLBACK TO sp_order;\n\n-- 保留 orders 的插入\nCOMMIT;",
  },
  {
    category: "事务管理", title: "隔离级别",
    description: "查看和设置事务隔离级别",
    code: "-- 查看当前隔离级别\nSELECT @@transaction_isolation;\n\n-- 设置会话级别\nSET SESSION TRANSACTION ISOLATION LEVEL\n  READ COMMITTED;\n\n-- 四种隔离级别：\n-- READ UNCOMMITTED  读未提交（最低）\n-- READ COMMITTED    读已提交\n-- REPEATABLE READ   可重复读（InnoDB默认）\n-- SERIALIZABLE      串行化（最高）",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html",
  },
  {
    category: "事务管理", title: "自动提交",
    description: "控制是否自动提交每条 SQL",
    code: "-- 查看自动提交状态\nSELECT @@autocommit;\n-- 关闭自动提交（需要手动 COMMIT）\nSET autocommit = 0;\n-- 开启自动提交\nSET autocommit = 1;",
  },
  {
    category: "事务管理", title: "死锁处理",
    description: "查看和处理死锁",
    code: "-- 查看最近的死锁信息\nSHOW ENGINE INNODB STATUS;\n-- 查看当前锁等待\nSELECT * FROM information_schema.INNODB_LOCK_WAITS;\n-- 查看正在运行的事务\nSELECT * FROM information_schema.INNODB_TRX;\n-- 杀掉阻塞的进程\nKILL <process_id>;",
  },
  {
    category: "事务管理", title: "锁操作",
    description: "手动加表锁和行锁",
    code: "-- 表锁\nLOCK TABLES users READ;\nLOCK TABLES users WRITE;\nUNLOCK TABLES;\n\n-- 行锁（InnoDB，需在事务中）\nSELECT * FROM users WHERE id = 1 FOR UPDATE;\nSELECT * FROM users WHERE id = 1 FOR SHARE;",
  },

  // ── 视图 ──
  {
    category: "视图", title: "创建视图",
    description: "基于查询创建虚拟表",
    code: "CREATE VIEW v_active_users AS\nSELECT id, name, email, last_login\nFROM users\nWHERE status = 'active';",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-view.html",
  },
  {
    category: "视图", title: "使用与管理视图",
    description: "查询视图、查看定义、修改和删除",
    code: "-- 像普通表一样查询\nSELECT * FROM v_active_users WHERE name LIKE '张%';\n-- 查看视图定义\nSHOW CREATE VIEW v_active_users;\n-- 查看所有视图\nSELECT TABLE_NAME FROM information_schema.VIEWS\nWHERE TABLE_SCHEMA = 'mydb';\n-- 修改视图\nALTER VIEW v_active_users AS\nSELECT id, name FROM users WHERE status = 'active';\n-- 删除视图\nDROP VIEW IF EXISTS v_active_users;",
  },

  // ── 存储过程与函数 ──
  {
    category: "存储过程与函数", title: "创建存储过程",
    description: "定义可重复调用的 SQL 程序",
    code: "DELIMITER //\nCREATE PROCEDURE sp_get_user(IN uid BIGINT)\nBEGIN\n  SELECT * FROM users WHERE id = uid;\nEND //\nDELIMITER ;\n\n-- 带输出参数\nDELIMITER //\nCREATE PROCEDURE sp_count_users(\n  IN city_name VARCHAR(50),\n  OUT total INT\n)\nBEGIN\n  SELECT COUNT(*) INTO total\n  FROM users WHERE city = city_name;\nEND //\nDELIMITER ;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-procedure.html",
  },
  {
    category: "存储过程与函数", title: "调用与管理存储过程",
    description: "调用、查看和删除存储过程",
    code: "-- 调用存储过程\nCALL sp_get_user(1);\n-- 带输出参数调用\nCALL sp_count_users('北京', @cnt);\nSELECT @cnt;\n-- 查看存储过程\nSHOW PROCEDURE STATUS WHERE Db = 'mydb';\n-- 查看定义\nSHOW CREATE PROCEDURE sp_get_user;\n-- 删除\nDROP PROCEDURE IF EXISTS sp_get_user;",
  },
  {
    category: "存储过程与函数", title: "自定义函数",
    description: "创建可在 SQL 中调用的自定义函数",
    code: "DELIMITER //\nCREATE FUNCTION fn_full_name(\n  first_name VARCHAR(50),\n  last_name VARCHAR(50)\n) RETURNS VARCHAR(101)\nDETERMINISTIC\nBEGIN\n  RETURN CONCAT(first_name, ' ', last_name);\nEND //\nDELIMITER ;\n\n-- 使用\nSELECT fn_full_name('张', '三') AS name;\nSELECT fn_full_name(first_name, last_name) FROM users;",
  },
  {
    category: "存储过程与函数", title: "流程控制",
    description: "存储过程中的 IF/CASE/WHILE/LOOP",
    code: "DELIMITER //\nCREATE PROCEDURE sp_classify_age(IN uid BIGINT)\nBEGIN\n  DECLARE user_age INT;\n  DECLARE label VARCHAR(20);\n\n  SELECT age INTO user_age FROM users WHERE id = uid;\n\n  IF user_age < 18 THEN\n    SET label = '未成年';\n  ELSEIF user_age < 60 THEN\n    SET label = '成年人';\n  ELSE\n    SET label = '老年人';\n  END IF;\n\n  SELECT uid, user_age, label;\nEND //\nDELIMITER ;",
  },

  // ── 备份与恢复 ──
  {
    category: "备份与恢复", title: "mysqldump 备份",
    description: "使用 mysqldump 导出数据库",
    code: "# 备份单个数据库\nmysqldump -u root -p mydb > mydb_backup.sql\n# 备份指定表\nmysqldump -u root -p mydb users orders > tables_backup.sql\n# 备份所有数据库\nmysqldump -u root -p --all-databases > all_backup.sql\n# 只导出结构（不含数据）\nmysqldump -u root -p --no-data mydb > schema.sql\n# 只导出数据（不含结构）\nmysqldump -u root -p --no-create-info mydb > data.sql",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html",
  },
  {
    category: "备份与恢复", title: "恢复数据",
    description: "从备份文件恢复数据库",
    code: "# 恢复数据库\nmysql -u root -p mydb < mydb_backup.sql\n# 恢复时创建数据库\nmysql -u root -p < all_backup.sql\n# 在 MySQL 内恢复\nSOURCE /path/to/backup.sql;",
  },
  {
    category: "备份与恢复", title: "导出导入 CSV",
    description: "导出数据为 CSV 或从 CSV 导入",
    code: "-- 导出为 CSV（需要 FILE 权限）\nSELECT * FROM users\nINTO OUTFILE '/tmp/users.csv'\nFIELDS TERMINATED BY ','\nENCLOSED BY '\"'\nLINES TERMINATED BY '\\n';\n\n-- 从 CSV 导入\nLOAD DATA INFILE '/tmp/users.csv'\nINTO TABLE users\nFIELDS TERMINATED BY ','\nENCLOSED BY '\"'\nLINES TERMINATED BY '\\n'\nIGNORE 1 ROWS;",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/load-data.html",
  },
  {
    category: "备份与恢复", title: "二进制日志",
    description: "查看和管理 binlog，用于增量恢复和主从复制",
    code: "-- 查看 binlog 是否开启\nSHOW VARIABLES LIKE 'log_bin';\n-- 查看所有 binlog 文件\nSHOW BINARY LOGS;\n-- 查看 binlog 内容\nSHOW BINLOG EVENTS IN 'mysql-bin.000001' LIMIT 20;\n-- 用 mysqlbinlog 工具查看\n# mysqlbinlog mysql-bin.000001\n-- 基于 binlog 做时间点恢复\n# mysqlbinlog --start-datetime='2024-01-01 00:00:00' \\\n#   --stop-datetime='2024-01-01 12:00:00' \\\n#   mysql-bin.000001 | mysql -u root -p",
  },

  // ── 性能优化 ──
  {
    category: "性能优化", title: "EXPLAIN 分析",
    description: "分析 SQL 执行计划，发现性能瓶颈",
    code: "-- 基本用法\nEXPLAIN SELECT * FROM users WHERE name = '张三';\n-- 详细格式\nEXPLAIN FORMAT=JSON\nSELECT * FROM users WHERE name = '张三';\n-- 关键字段说明：\n-- type: ALL(全表扫描) > index > range > ref > eq_ref > const\n-- key:  实际使用的索引\n-- rows: 预估扫描行数\n-- Extra: Using index(覆盖索引), Using filesort(需要排序)",
    docUrl: "https://dev.mysql.com/doc/refman/8.0/en/explain-output.html",
  },
  {
    category: "性能优化", title: "慢查询日志",
    description: "开启和分析慢查询日志",
    code: "-- 查看慢查询配置\nSHOW VARIABLES LIKE 'slow_query%';\nSHOW VARIABLES LIKE 'long_query_time';\n-- 开启慢查询日志\nSET GLOBAL slow_query_log = 'ON';\nSET GLOBAL long_query_time = 1;\nSET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';\n-- 分析慢查询日志\n# mysqldumpslow -s t -t 10 /var/log/mysql/slow.log",
  },
  {
    category: "性能优化", title: "进程与连接",
    description: "查看和管理当前连接和查询",
    code: "-- 查看当前所有进程\nSHOW PROCESSLIST;\nSHOW FULL PROCESSLIST;\n-- 杀掉某个长时间运行的查询\nKILL <process_id>;\n-- 查看最大连接数\nSHOW VARIABLES LIKE 'max_connections';\n-- 查看当前连接数\nSHOW STATUS LIKE 'Threads_connected';",
  },
  {
    category: "性能优化", title: "表维护",
    description: "分析、优化和检查表",
    code: "-- 分析表（更新索引统计信息）\nANALYZE TABLE users;\n-- 优化表（回收碎片空间）\nOPTIMIZE TABLE users;\n-- 检查表完整性\nCHECK TABLE users;\n-- 修复表\nREPAIR TABLE users;\n-- 查看表状态\nSHOW TABLE STATUS LIKE 'users';",
  },
  {
    category: "性能优化", title: "服务器状态",
    description: "查看 MySQL 服务器运行状态和变量",
    code: "-- 查看 InnoDB 引擎状态\nSHOW ENGINE INNODB STATUS;\n-- 查看全局状态变量\nSHOW GLOBAL STATUS;\n-- 查看缓冲池命中率\nSHOW STATUS LIKE 'Innodb_buffer_pool%';\n-- 查看系统变量\nSHOW VARIABLES LIKE 'innodb_buffer_pool_size';\n-- 查看表空间使用\nSELECT table_name,\n  ROUND(data_length/1024/1024, 2) AS data_mb,\n  ROUND(index_length/1024/1024, 2) AS index_mb\nFROM information_schema.tables\nWHERE table_schema = 'mydb'\nORDER BY data_length DESC;",
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
