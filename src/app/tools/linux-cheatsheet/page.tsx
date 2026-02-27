"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = [
  "文件操作",
  "目录操作",
  "文件查看",
  "搜索查找",
  "权限管理",
  "进程管理",
  "网络",
  "磁盘与系统",
  "压缩解压",
  "用户管理",
];

const items: CheatItem[] = [
  // 文件操作
  {
    category: "文件操作",
    title: "复制文件 cp",
    description: "复制文件或目录，-r 递归复制目录",
    code: "# 复制文件\ncp file.txt backup.txt\n# 递归复制目录\ncp -r dir1 dir2\n# 保留属性\ncp -a source dest",
  },
  {
    category: "文件操作",
    title: "移动/重命名 mv",
    description: "移动文件或目录，也可用于重命名",
    code: "# 移动文件\nmv file.txt /path/to/dest/\n# 重命名\nmv oldname.txt newname.txt\n# 强制覆盖（不提示）\nmv -f source dest",
  },
  {
    category: "文件操作",
    title: "删除文件 rm",
    description: "删除文件或目录，-r 递归删除，-f 强制",
    code: "# 删除文件\nrm file.txt\n# 递归删除目录\nrm -r dir/\n# 强制删除（不提示）\nrm -rf dir/\n# 交互式删除\nrm -i file.txt",
  },
  {
    category: "文件操作",
    title: "创建空文件 touch",
    description: "创建空文件或更新文件时间戳",
    code: "# 创建空文件\ntouch newfile.txt\n# 更新多个文件的时间戳\ntouch file1.txt file2.txt",
  },
  {
    category: "文件操作",
    title: "创建链接 ln",
    description: "创建硬链接或软链接（符号链接）",
    code: "# 创建硬链接\nln file.txt hardlink.txt\n# 创建软链接（符号链接）\nln -s /path/to/file link_name",
  },

  // 目录操作
  {
    category: "目录操作",
    title: "列出目录 ls",
    description: "列出目录内容，-l 详细信息，-a 显示隐藏文件",
    code: "# 简单列出\nls\n# 详细信息（含权限、大小）\nls -l\n# 显示隐藏文件\nls -la\n# 按大小排序\nls -lhS\n# 递归列出子目录\nls -R",
  },
  {
    category: "目录操作",
    title: "创建目录 mkdir",
    description: "创建新目录，-p 递归创建多级目录",
    code: "# 创建单个目录\nmkdir mydir\n# 递归创建多级目录\nmkdir -p parent/child/grandchild\n# 创建时设置权限\nmkdir -m 755 mydir",
  },
  {
    category: "目录操作",
    title: "切换目录 cd",
    description: "切换当前工作目录",
    code: "# 进入目录\ncd /path/to/dir\n# 进入家目录\ncd ~\n# 返回上级目录\ncd ..\n# 返回上上次目录\ncd -",
  },
  {
    category: "目录操作",
    title: "当前目录 pwd",
    description: "显示当前工作目录的绝对路径",
    code: "pwd",
  },
  {
    category: "目录操作",
    title: "目录大小 du",
    description: "显示目录或文件的磁盘使用量",
    code: "# 当前目录大小\ndu -sh .\n# 显示子目录大小\ndu -h --max-depth=1\n# 人类可读格式\ndu -sh *",
  },

  // 文件查看
  {
    category: "文件查看",
    title: "查看文件 cat",
    description: "连接并显示文件内容",
    code: "# 查看文件\ncat file.txt\n# 显示行号\ncat -n file.txt\n# 合并多个文件\ncat file1.txt file2.txt > combined.txt",
  },
  {
    category: "文件查看",
    title: "分页查看 less",
    description: "分页查看大文件，支持上下翻页和搜索",
    code: "# 分页查看\nless file.txt\n# 常用操作：空格翻页，b 回翻，/ 搜索，q 退出",
  },
  {
    category: "文件查看",
    title: "查看头部 head",
    description: "显示文件开头若干行",
    code: "# 默认显示前 10 行\nhead file.txt\n# 显示前 20 行\nhead -n 20 file.txt\n# 或\nhead -20 file.txt",
  },
  {
    category: "文件查看",
    title: "查看尾部 tail",
    description: "显示文件末尾若干行，-f 实时跟踪",
    code: "# 默认显示后 10 行\ntail file.txt\n# 显示后 50 行\ntail -n 50 file.txt\n# 实时跟踪日志\ntail -f /var/log/app.log",
  },
  {
    category: "文件查看",
    title: "统计字数 wc",
    description: "统计文件行数、字数、字节数",
    code: "# 显示行数、字数、字节数\nwc file.txt\n# 只显示行数\nwc -l file.txt\n# 只显示字数\nwc -w file.txt",
  },

  // 搜索查找
  {
    category: "搜索查找",
    title: "文本搜索 grep",
    description: "在文件中搜索匹配的文本行",
    code: "# 基本搜索\ngrep \"pattern\" file.txt\n# 忽略大小写\ngrep -i \"pattern\" file.txt\n# 递归搜索目录\ngrep -r \"pattern\" ./dir\n# 显示行号\ngrep -n \"pattern\" file.txt",
  },
  {
    category: "搜索查找",
    title: "查找文件 find",
    description: "在目录树中查找文件",
    code: "# 按名称查找\nfind . -name \"*.txt\"\n# 按类型查找\nfind . -type f -name \"*.log\"\n# 按时间查找（7天内修改）\nfind . -mtime -7\n# 执行命令\nfind . -name \"*.tmp\" -exec rm {} \\;",
  },
  {
    category: "搜索查找",
    title: "快速查找 locate",
    description: "通过数据库快速查找文件（需先 updatedb）",
    code: "# 查找文件\nlocate filename\n# 忽略大小写\nlocate -i pattern\n# 限制结果数量\nlocate -n 20 pattern",
  },
  {
    category: "搜索查找",
    title: "查找命令 which",
    description: "显示命令的完整路径",
    code: "which python\nwhich git\nwhich node",
  },
  {
    category: "搜索查找",
    title: "查找命令 whereis",
    description: "查找命令、源码和手册页位置",
    code: "whereis python\nwhereis ls",
  },

  // 权限管理
  {
    category: "权限管理",
    title: "修改权限 chmod",
    description: "修改文件或目录的访问权限",
    code: "# 数字模式：755 = rwxr-xr-x\nchmod 755 script.sh\n# 符号模式：给所有用户加执行权限\nchmod +x file.sh\n# 递归修改目录\nchmod -R 755 mydir",
  },
  {
    category: "权限管理",
    title: "修改所有者 chown",
    description: "修改文件或目录的所有者和所属组",
    code: "# 修改所有者\nchown user file.txt\n# 修改所有者和组\nchown user:group file.txt\n# 递归修改\nchown -R user:group dir/",
  },
  {
    category: "权限管理",
    title: "修改所属组 chgrp",
    description: "修改文件或目录的所属组",
    code: "chgrp developers file.txt\nchgrp -R www-data /var/www/",
  },
  {
    category: "权限管理",
    title: "默认权限 umask",
    description: "设置新建文件的默认权限掩码",
    code: "# 查看当前 umask\numask\n# 设置 umask（如 022）\numask 022",
  },
  {
    category: "权限管理",
    title: "查看权限 stat",
    description: "显示文件或文件系统的详细状态信息",
    code: "stat file.txt\n# 简洁格式\nstat -c '%a %n' file.txt",
  },

  // 进程管理
  {
    category: "进程管理",
    title: "查看进程 ps",
    description: "显示当前进程状态",
    code: "# 显示所有进程\nps aux\n# 树形显示\nps auxf\n# 显示指定用户进程\nps -u username",
  },
  {
    category: "进程管理",
    title: "实时监控 top",
    description: "实时显示系统进程和资源使用情况",
    code: "# 启动 top\ntop\n# 按 P 按 CPU 排序，M 按内存排序，q 退出",
  },
  {
    category: "进程管理",
    title: "终止进程 kill",
    description: "向进程发送信号，默认 SIGTERM",
    code: "# 优雅终止（默认）\nkill 12345\n# 强制终止\nkill -9 12345\n# 按名称终止\nkillall process_name",
  },
  {
    category: "进程管理",
    title: "后台运行 nohup",
    description: "忽略挂断信号，使进程在退出终端后继续运行",
    code: "# 后台运行，输出到 nohup.out\nnohup command &\n# 指定输出文件\nnohup python app.py > output.log 2>&1 &",
  },
  {
    category: "进程管理",
    title: "进程树 pstree",
    description: "以树形结构显示进程关系",
    code: "pstree\npstree -p  # 显示 PID\npstree -u  # 显示用户名",
  },

  // 网络
  {
    category: "网络",
    title: "测试连通性 ping",
    description: "测试与目标主机的网络连通性",
    code: "# 持续 ping\nping example.com\n# 指定次数\nping -c 4 example.com\n# 指定间隔（秒）\nping -i 2 192.168.1.1",
  },
  {
    category: "网络",
    title: "下载文件 wget",
    description: "从网络下载文件",
    code: "# 下载文件\nwget https://example.com/file.zip\n# 断点续传\nwget -c url\n# 后台下载\nwget -b url",
  },
  {
    category: "网络",
    title: "HTTP 请求 curl",
    description: "发送 HTTP 请求，支持多种协议",
    code: "# GET 请求\ncurl https://api.example.com\n# POST 请求\ncurl -X POST -d 'data' url\n# 显示响应头\ncurl -i url\n# 保存到文件\ncurl -o file.txt url",
  },
  {
    category: "网络",
    title: "网络状态 netstat",
    description: "显示网络连接、路由表、接口统计",
    code: "# 显示所有连接\nnetstat -a\n# 显示监听端口\nnetstat -tuln\n# 显示进程\nnetstat -tulnp",
  },
  {
    category: "网络",
    title: "SSH 远程连接",
    description: "安全连接到远程主机",
    code: "# 基本连接\nssh user@host\n# 指定端口\nssh -p 2222 user@host\n# 使用密钥\nssh -i ~/.ssh/id_rsa user@host",
  },
  {
    category: "网络",
    title: "SCP 文件传输",
    description: "通过 SSH 安全复制文件",
    code: "# 上传到远程\nscp file.txt user@host:/path/\n# 从远程下载\nscp user@host:/path/file.txt .\n# 递归复制目录\nscp -r dir/ user@host:/path/",
  },

  // 磁盘与系统
  {
    category: "磁盘与系统",
    title: "磁盘空间 df",
    description: "显示文件系统磁盘空间使用情况",
    code: "# 人类可读格式\ndf -h\n# 显示 inode 使用\ndf -i\n# 指定文件系统类型\ndf -t ext4",
  },
  {
    category: "磁盘与系统",
    title: "内存使用 free",
    description: "显示系统内存使用情况",
    code: "# 人类可读格式\nfree -h\n# 持续监控\nfree -h -s 2",
  },
  {
    category: "磁盘与系统",
    title: "系统信息 uname",
    description: "显示系统信息",
    code: "# 内核名称\nuname\n# 详细信息\nuname -a\n# 内核版本\nuname -r\n# 机器架构\nuname -m",
  },
  {
    category: "磁盘与系统",
    title: "系统负载 uptime",
    description: "显示系统运行时间和负载",
    code: "uptime",
  },
  {
    category: "磁盘与系统",
    title: "环境变量 env",
    description: "显示或设置环境变量",
    code: "# 显示所有环境变量\nenv\n# 在指定环境下执行命令\nenv VAR=value command",
  },

  // 压缩解压
  {
    category: "压缩解压",
    title: "tar 打包压缩",
    description: "打包和压缩文件，常用 .tar.gz 格式",
    code: "# 打包（不压缩）\ntar -cvf archive.tar dir/\n# 打包并 gzip 压缩\ntar -czvf archive.tar.gz dir/\n# 解压 .tar.gz\ntar -xzvf archive.tar.gz\n# 解压到指定目录\ntar -xzvf archive.tar.gz -C /path/to/dest/",
  },
  {
    category: "压缩解压",
    title: "zip 压缩",
    description: "创建和解压 zip 格式压缩包",
    code: "# 压缩文件\nzip archive.zip file1 file2\n# 递归压缩目录\nzip -r archive.zip dir/\n# 解压\nunzip archive.zip\n# 解压到指定目录\nunzip archive.zip -d /path/to/dest/",
  },
  {
    category: "压缩解压",
    title: "gzip 压缩",
    description: "压缩单个文件，生成 .gz 文件",
    code: "# 压缩（会删除原文件）\ngzip file.txt\n# 保留原文件\ngzip -k file.txt\n# 解压\ngunzip file.txt.gz",
  },
  {
    category: "压缩解压",
    title: "xz 高压缩",
    description: "高压缩比格式，适合大文件",
    code: "# 压缩\nxz file.txt\n# 解压\nxz -d file.txt.xz\n# 或\nunxz file.txt.xz",
  },
  {
    category: "压缩解压",
    title: "7z 多格式",
    description: "支持多种压缩格式",
    code: "# 压缩\n7z a archive.7z dir/\n# 解压\n7z x archive.7z",
  },

  // 用户管理
  {
    category: "用户管理",
    title: "当前用户 whoami",
    description: "显示当前登录用户名",
    code: "whoami",
  },
  {
    category: "用户管理",
    title: "切换用户 su",
    description: "切换到其他用户，默认切换到 root",
    code: "# 切换到 root\nsu\n# 切换到指定用户\nsu username\n# 切换用户并加载环境\nsu - username",
  },
  {
    category: "用户管理",
    title: "添加用户 useradd",
    description: "创建新用户账户",
    code: "# 创建用户\nuseradd -m username\n# 指定家目录和 shell\nuseradd -m -s /bin/bash username\n# 指定 UID\nuseradd -u 1001 username",
  },
  {
    category: "用户管理",
    title: "修改密码 passwd",
    description: "修改用户密码",
    code: "# 修改当前用户密码\npasswd\n# 修改指定用户密码（需 root）\npasswd username",
  },
  {
    category: "用户管理",
    title: "用户信息 id",
    description: "显示用户和组的 ID 信息",
    code: "# 当前用户\nid\n# 指定用户\nid username",
  },
];

export default function LinuxCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Linux 命令速查"
        subtitle="Linux 常用命令速查表，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
