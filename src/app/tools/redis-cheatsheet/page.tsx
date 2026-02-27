"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["连接与通用", "String 字符串", "Hash 哈希", "List 列表", "Set 集合", "Sorted Set 有序集合", "Stream", "Bitmap & HyperLogLog & Geo", "Key 管理", "发布订阅", "事务与Lua", "持久化与运维"];

const items: CheatItem[] = [
  // 连接与通用
  { category: "连接与通用", title: "连接 Redis", description: "使用 redis-cli 连接服务器", code: "# 本地连接\nredis-cli\n# 远程连接\nredis-cli -h 192.168.1.100 -p 6379\n# 带密码\nredis-cli -h host -p 6379 -a password\n# 选择数据库\nSELECT 1" },
  { category: "连接与通用", title: "测试连接", description: "检查 Redis 是否正常", code: "PING\n# 返回 PONG 表示正常" },
  { category: "连接与通用", title: "查看信息", description: "查看服务器信息", code: "INFO\n# 查看内存信息\nINFO memory\n# 查看客户端\nINFO clients\n# 查看统计\nINFO stats" },
  { category: "连接与通用", title: "数据库大小", description: "查看当前库的 Key 数量", code: "DBSIZE" },
  { category: "连接与通用", title: "ACL 访问控制", description: "Redis 6+ 用户与权限管理", code: "# 列出所有用户\nACL LIST\n# 查看用户权限\nACL GETUSER default\n# 创建用户\nACL SETUSER myuser on >mypass ~user:* +get +set" },

  // String
  { category: "String 字符串", title: "设置/获取值", description: "最基本的键值操作", code: "# 设置\nSET name \"张三\"\n# 获取\nGET name\n# 设置并返回旧值\nGETSET name \"李四\"" },
  { category: "String 字符串", title: "设置过期时间", description: "设置值同时设定过期", code: "# 秒\nSET token \"abc123\" EX 3600\n# 毫秒\nSET token \"abc123\" PX 3600000\n# 等效命令\nSETEX token 3600 \"abc123\"" },
  { category: "String 字符串", title: "不存在时才设置", description: "用于分布式锁等场景", code: "# 不存在才设置\nSET lock \"1\" NX EX 30\n# 等效\nSETNX lock \"1\"" },
  { category: "String 字符串", title: "批量操作", description: "一次设置/获取多个值", code: "# 批量设置\nMSET name \"张三\" age \"25\" city \"北京\"\n# 批量获取\nMGET name age city" },
  { category: "String 字符串", title: "计数器", description: "原子递增递减", code: "SET views 0\n# 递增 1\nINCR views\n# 递增 N\nINCRBY views 10\n# 递减\nDECR views\nDECRBY views 5" },
  { category: "String 字符串", title: "字符串操作", description: "追加、截取、长度", code: "# 追加\nAPPEND name \" 先生\"\n# 长度\nSTRLEN name\n# 截取\nGETRANGE name 0 2" },
  { category: "String 字符串", title: "浮点计数", description: "浮点数原子递增", code: "SET price 99.5\nINCRBYFLOAT price 0.5" },

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
  { category: "Set 集合", title: "集合运算存储", description: "运算结果存入新 Key", code: "SINTERSTORE dest set1 set2\nSUNIONSTORE dest set1 set2\nSDIFFSTORE dest set1 set2" },

  // Sorted Set
  { category: "Sorted Set 有序集合", title: "添加成员", description: "添加带分数的成员", code: "ZADD leaderboard 100 \"player1\"\nZADD leaderboard 85 \"player2\"\nZADD leaderboard 92 \"player3\"" },
  { category: "Sorted Set 有序集合", title: "排行榜查询", description: "按分数排名查询", code: "# 升序排名（分数低到高）\nZRANGE leaderboard 0 -1 WITHSCORES\n# 降序排名（分数高到低）\nZREVRANGE leaderboard 0 9 WITHSCORES\n# 查排名\nZREVRANK leaderboard \"player1\"\n# 查分数\nZSCORE leaderboard \"player1\"" },
  { category: "Sorted Set 有序集合", title: "范围查询", description: "按分数范围查询", code: "# 分数在 80-100 之间\nZRANGEBYSCORE leaderboard 80 100\n# 统计范围内数量\nZCOUNT leaderboard 80 100\n# 成员总数\nZCARD leaderboard" },
  { category: "Sorted Set 有序集合", title: "增加分数", description: "原子递增成员分数", code: "ZINCRBY leaderboard 10 \"player2\"" },
  { category: "Sorted Set 有序集合", title: "删除成员", description: "按排名或分数范围删除", code: "ZREM leaderboard \"player3\"\nZREMRANGEBYRANK leaderboard 0 2\nZREMRANGEBYSCORE leaderboard 0 80" },

  // Stream
  { category: "Stream", title: "添加消息", description: "向流追加消息", code: "XADD mystream * msg \"hello\" user \"tom\"\n# 指定最大长度\nXADD mystream MAXLEN 1000 * msg \"hello\"" },
  { category: "Stream", title: "读取消息", description: "按 ID 或时间读取", code: "# 从最新开始读\nXREAD STREAMS mystream 0\n# 阻塞读取\nXREAD BLOCK 5000 STREAMS mystream $\n# 范围读取\nXRANGE mystream - +" },
  { category: "Stream", title: "范围查询", description: "按 ID 范围查询流", code: "XRANGE mystream - +\nXRANGE mystream 0 9999999999999\nXLEN mystream" },
  { category: "Stream", title: "消费组", description: "创建和管理消费组", code: "XGROUP CREATE mystream mygroup 0\nXGROUP CREATECONSUMER mystream mygroup c1\nXGROUP DESTROY mystream mygroup" },
  { category: "Stream", title: "消费组读取", description: "消费组内读取消息", code: "XREADGROUP GROUP mygroup c1 STREAMS mystream >\nXACK mystream mygroup id1 id2\nXPENDING mystream mygroup" },

  // Bitmap & HyperLogLog & Geo
  { category: "Bitmap & HyperLogLog & Geo", title: "Bitmap 位图", description: "位级操作，签到、在线状态", code: "SETBIT sign:user:1 0 1\nSETBIT sign:user:1 1 0\nGETBIT sign:user:1 0\nBITCOUNT sign:user:1" },
  { category: "Bitmap & HyperLogLog & Geo", title: "BITOP 位运算", description: "多键位运算", code: "BITOP AND dest key1 key2\nBITOP OR dest key1 key2\nBITOP XOR dest key1 key2\nBITOP NOT dest key1" },
  { category: "Bitmap & HyperLogLog & Geo", title: "HyperLogLog", description: "基数统计，极低内存", code: "PFADD uv:20240227 user1 user2 user3\nPFCOUNT uv:20240227\nPFMERGE uv:week uv:mon uv:tue uv:wed" },
  { category: "Bitmap & HyperLogLog & Geo", title: "地理位置添加", description: "添加经纬度坐标", code: "GEOADD locations 116.397128 39.916527 \"北京\"\nGEOADD locations 121.473701 31.230416 \"上海\"" },
  { category: "Bitmap & HyperLogLog & Geo", title: "地理位置查询", description: "距离、范围、搜索", code: "GEODIST locations \"北京\" \"上海\" km\nGEORADIUS locations 116.4 39.9 100 km WITHDIST\nGEOSEARCH locations FROMMEMBER \"北京\" BYRADIUS 500 km" },
  { category: "Bitmap & HyperLogLog & Geo", title: "GEOHASH", description: "获取坐标的 Geohash 字符串", code: "GEOHASH locations \"北京\" \"上海\"" },

  // Key 管理
  { category: "Key 管理", title: "查找 Key", description: "按模式搜索 Key", code: "# 所有 Key（生产慎用）\nKEYS *\n# 匹配模式\nKEYS user:*\n# 推荐用 SCAN\nSCAN 0 MATCH user:* COUNT 100" },
  { category: "Key 管理", title: "SCAN 迭代", description: "游标迭代，不阻塞", code: "SCAN 0 MATCH user:* COUNT 100\n# 返回下次游标，0 表示结束\n# HSCAN/SSCAN/ZSCAN 用于 Hash/Set/ZSet" },
  { category: "Key 管理", title: "过期时间", description: "设置和查看过期时间", code: "# 设置过期（秒）\nEXPIRE key 3600\n# 设置过期（毫秒）\nPEXPIRE key 3600000\n# 查看剩余时间\nTTL key\n# 移除过期\nPERSIST key" },
  { category: "Key 管理", title: "删除/检查", description: "删除和检查 Key", code: "# 删除\nDEL key1 key2\n# 异步删除（大 Key）\nUNLINK key1\n# 是否存在\nEXISTS key\n# 查看类型\nTYPE key" },
  { category: "Key 管理", title: "重命名", description: "重命名 Key", code: "RENAME oldkey newkey\n# 不存在才重命名\nRENAMENX oldkey newkey" },
  { category: "Key 管理", title: "内部编码", description: "查看 Key 的底层编码", code: "OBJECT ENCODING mykey\n# 返回: string, list, ziplist, intset 等\nOBJECT REFCOUNT mykey\nOBJECT IDLETIME mykey" },
  { category: "Key 管理", title: "TTL 毫秒与时间戳", description: "毫秒级 TTL 和 Unix 时间戳过期", code: "PTTL key\nEXPIREAT key 1700000000\nPEXPIREAT key 1700000000000" },

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
  { category: "持久化与运维", title: "CONFIG 配置", description: "动态获取和修改配置", code: "CONFIG GET maxmemory\nCONFIG SET maxmemory 256mb\nCONFIG REWRITE" },
  { category: "持久化与运维", title: "INFO 详细分区", description: "各模块详细信息", code: "INFO server\nINFO memory\nINFO replication\nINFO persistence\nINFO stats\nINFO clients" },
  { category: "持久化与运维", title: "内存管理", description: "内存分析与诊断", code: "MEMORY USAGE key\nMEMORY STATS\nMEMORY DOCTOR\nMEMORY PURGE" },
  { category: "持久化与运维", title: "Cluster 集群", description: "集群管理命令", code: "CLUSTER INFO\nCLUSTER NODES\nCLUSTER MEET 192.168.1.2 6379\nCLUSTER SLOTS" },
  { category: "持久化与运维", title: "Sentinel 哨兵", description: "哨兵高可用命令", code: "SENTINEL masters\nSENTINEL get-master-addr-by-name mymaster\nSENTINEL slaves mymaster" },
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
