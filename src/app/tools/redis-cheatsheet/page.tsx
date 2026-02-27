"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["连接与通用", "String 字符串", "Hash 哈希", "List 列表", "Set 集合", "Sorted Set 有序集合", "Key 管理", "发布订阅", "事务与Lua", "持久化与运维"];

const items: CheatItem[] = [
  // 连接与通用
  { category: "连接与通用", title: "连接 Redis", description: "使用 redis-cli 连接服务器", code: "# 本地连接\nredis-cli\n# 远程连接\nredis-cli -h 192.168.1.100 -p 6379\n# 带密码\nredis-cli -h host -p 6379 -a password\n# 选择数据库\nSELECT 1" },
  { category: "连接与通用", title: "测试连接", description: "检查 Redis 是否正常", code: "PING\n# 返回 PONG 表示正常" },
  { category: "连接与通用", title: "查看信息", description: "查看服务器信息", code: "INFO\n# 查看内存信息\nINFO memory\n# 查看客户端\nINFO clients\n# 查看统计\nINFO stats" },
  { category: "连接与通用", title: "数据库大小", description: "查看当前库的 Key 数量", code: "DBSIZE" },

  // String
  { category: "String 字符串", title: "设置/获取值", description: "最基本的键值操作", code: "# 设置\nSET name \"张三\"\n# 获取\nGET name\n# 设置并返回旧值\nGETSET name \"李四\"" },
  { category: "String 字符串", title: "设置过期时间", description: "设置值同时设定过期", code: "# 秒\nSET token \"abc123\" EX 3600\n# 毫秒\nSET token \"abc123\" PX 3600000\n# 等效命令\nSETEX token 3600 \"abc123\"" },
  { category: "String 字符串", title: "不存在时才设置", description: "用于分布式锁等场景", code: "# 不存在才设置\nSET lock \"1\" NX EX 30\n# 等效\nSETNX lock \"1\"" },
  { category: "String 字符串", title: "批量操作", description: "一次设置/获取多个值", code: "# 批量设置\nMSET name \"张三\" age \"25\" city \"北京\"\n# 批量获取\nMGET name age city" },
  { category: "String 字符串", title: "计数器", description: "原子递增递减", code: "SET views 0\n# 递增 1\nINCR views\n# 递增 N\nINCRBY views 10\n# 递减\nDECR views\nDECRBY views 5" },
  { category: "String 字符串", title: "字符串操作", description: "追加、截取、长度", code: "# 追加\nAPPEND name \" 先生\"\n# 长度\nSTRLEN name\n# 截取\nGETRANGE name 0 2" },

  // Hash
  { category: "Hash 哈希", title: "设置/获取字段", description: "操作哈希表字段", code: "# 设置单个字段\nHSET user:1 name \"张三\"\nHSET user:1 age 25\n# 获取单个字段\nHGET user:1 name\n# 获取所有字段\nHGETALL user:1" },
  { category: "Hash 哈希", title: "批量设置", description: "一次设置多个字段", code: "HMSET user:1 name \"张三\" age 25 email \"zhang@example.com\"\n# 获取多个\nHMGET user:1 name age email" },
  { category: "Hash 哈希", title: "其他操作", description: "删除、存在、所有键", code: "# 删除字段\nHDEL user:1 email\n# 是否存在\nHEXISTS user:1 name\n# 所有字段名\nHKEYS user:1\n# 所有值\nHVALS user:1\n# 字段数量\nHLEN user:1" },
  { category: "Hash 哈希", title: "字段计数", description: "哈希字段的原子递增", code: "HINCRBY user:1 age 1\nHINCRBYFLOAT product:1 price 9.99" },

  // List
  { category: "List 列表", title: "添加元素", description: "从头部或尾部添加", code: "# 头部添加\nLPUSH queue \"task1\" \"task2\"\n# 尾部添加\nRPUSH queue \"task3\"\n# 指定位置插入\nLINSERT queue BEFORE \"task3\" \"task2.5\"" },
  { category: "List 列表", title: "弹出元素", description: "从头部或尾部取出", code: "# 头部弹出\nLPOP queue\n# 尾部弹出\nRPOP queue\n# 阻塞弹出（消息队列）\nBLPOP queue 30" },
  { category: "List 列表", title: "查看元素", description: "按索引或范围查看", code: "# 查看全部\nLRANGE queue 0 -1\n# 查看前 10 个\nLRANGE queue 0 9\n# 按索引获取\nLINDEX queue 0\n# 列表长度\nLLEN queue" },
  { category: "List 列表", title: "修剪列表", description: "只保留指定范围的元素", code: "# 只保留最新 100 条\nLTRIM queue 0 99" },

  // Set
  { category: "Set 集合", title: "添加/查看成员", description: "集合的基本操作", code: "# 添加\nSADD tags \"java\" \"python\" \"go\"\n# 所有成员\nSMEMBERS tags\n# 成员数量\nSCARD tags\n# 是否存在\nSISMEMBER tags \"java\"" },
  { category: "Set 集合", title: "删除/随机", description: "删除和随机操作", code: "# 删除\nSREM tags \"go\"\n# 随机取一个\nSRANDMEMBER tags\n# 随机弹出\nSPOP tags" },
  { category: "Set 集合", title: "集合运算", description: "交集、并集、差集", code: "SADD set1 \"a\" \"b\" \"c\"\nSADD set2 \"b\" \"c\" \"d\"\n# 交集\nSINTER set1 set2       # b, c\n# 并集\nSUNION set1 set2       # a, b, c, d\n# 差集\nSDIFF set1 set2        # a" },

  // Sorted Set
  { category: "Sorted Set 有序集合", title: "添加成员", description: "添加带分数的成员", code: "ZADD leaderboard 100 \"player1\"\nZADD leaderboard 85 \"player2\"\nZADD leaderboard 92 \"player3\"" },
  { category: "Sorted Set 有序集合", title: "排行榜查询", description: "按分数排名查询", code: "# 升序排名（分数低到高）\nZRANGE leaderboard 0 -1 WITHSCORES\n# 降序排名（分数高到低）\nZREVRANGE leaderboard 0 9 WITHSCORES\n# 查排名\nZREVRANK leaderboard \"player1\"\n# 查分数\nZSCORE leaderboard \"player1\"" },
  { category: "Sorted Set 有序集合", title: "范围查询", description: "按分数范围查询", code: "# 分数在 80-100 之间\nZRANGEBYSCORE leaderboard 80 100\n# 统计范围内数量\nZCOUNT leaderboard 80 100\n# 成员总数\nZCARD leaderboard" },
  { category: "Sorted Set 有序集合", title: "增加分数", description: "原子递增成员分数", code: "ZINCRBY leaderboard 10 \"player2\"" },

  // Key 管理
  { category: "Key 管理", title: "查找 Key", description: "按模式搜索 Key", code: "# 所有 Key（生产慎用）\nKEYS *\n# 匹配模式\nKEYS user:*\n# 推荐用 SCAN\nSCAN 0 MATCH user:* COUNT 100" },
  { category: "Key 管理", title: "过期时间", description: "设置和查看过期时间", code: "# 设置过期（秒）\nEXPIRE key 3600\n# 设置过期（毫秒）\nPEXPIRE key 3600000\n# 查看剩余时间\nTTL key\n# 移除过期\nPERSIST key" },
  { category: "Key 管理", title: "删除/检查", description: "删除和检查 Key", code: "# 删除\nDEL key1 key2\n# 异步删除（大 Key）\nUNLINK key1\n# 是否存在\nEXISTS key\n# 查看类型\nTYPE key" },
  { category: "Key 管理", title: "重命名", description: "重命名 Key", code: "RENAME oldkey newkey\n# 不存在才重命名\nRENAMENX oldkey newkey" },

  // 发布订阅
  { category: "发布订阅", title: "发布消息", description: "向频道发送消息", code: "PUBLISH chat \"Hello World\"" },
  { category: "发布订阅", title: "订阅频道", description: "订阅一个或多个频道", code: "# 订阅指定频道\nSUBSCRIBE chat\n# 模式订阅\nPSUBSCRIBE chat:*" },

  // 事务与Lua
  { category: "事务与Lua", title: "事务", description: "Redis 事务操作", code: "MULTI\nSET balance 100\nDECRBY balance 20\nINCRBY balance 50\nEXEC\n# 取消事务\nDISCARD" },
  { category: "事务与Lua", title: "Lua 脚本", description: "执行 Lua 脚本保证原子性", code: "# 限流脚本示例\nEVAL \"\n  local current = redis.call('INCR', KEYS[1])\n  if current == 1 then\n    redis.call('EXPIRE', KEYS[1], ARGV[1])\n  end\n  return current\n\" 1 rate:api 60" },

  // 持久化与运维
  { category: "持久化与运维", title: "RDB 快照", description: "手动触发 RDB 持久化", code: "# 阻塞保存\nSAVE\n# 后台保存（推荐）\nBGSAVE\n# 查看上次保存时间\nLASTSAVE" },
  { category: "持久化与运维", title: "AOF 持久化", description: "AOF 相关操作", code: "# 手动触发 AOF 重写\nBGREWRITEAOF\n\n# redis.conf 配置\nappendonly yes\nappendfsync everysec" },
  { category: "持久化与运维", title: "清空数据", description: "清空当前库或所有库", code: "# 清空当前库\nFLUSHDB\n# 清空所有库（危险！）\nFLUSHALL" },
  { category: "持久化与运维", title: "慢查询", description: "查看慢查询日志", code: "# 查看慢查询\nSLOWLOG GET 10\n# 慢查询数量\nSLOWLOG LEN\n\n# redis.conf 配置\nslowlog-log-slower-than 10000  # 微秒\nslowlog-max-len 128" },
];

export default function RedisCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Redis 命令速查"
        subtitle="Redis 数据结构、命令、持久化、运维操作速查，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
