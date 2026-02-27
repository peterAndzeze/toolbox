"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["镜像管理", "容器生命周期", "容器信息", "网络", "数据卷", "Docker Compose", "Dockerfile", "清理维护"];

const items: CheatItem[] = [
  // 镜像管理
  { category: "镜像管理", title: "拉取镜像", description: "从 Docker Hub 拉取镜像", code: "# 拉取最新版\ndocker pull nginx\n# 拉取指定版本\ndocker pull nginx:1.25\n# 拉取指定平台\ndocker pull --platform linux/amd64 nginx" },
  { category: "镜像管理", title: "查看本地镜像", description: "列出本地所有镜像", code: "docker images\n# 按大小排序\ndocker images --format '{{.Repository}}:{{.Tag}} {{.Size}}'" },
  { category: "镜像管理", title: "构建镜像", description: "从 Dockerfile 构建镜像", code: "# 当前目录构建\ndocker build -t myapp:1.0 .\n# 指定 Dockerfile\ndocker build -f Dockerfile.prod -t myapp:prod .\n# 不使用缓存\ndocker build --no-cache -t myapp:1.0 ." },
  { category: "镜像管理", title: "删除镜像", description: "删除本地镜像", code: "# 删除单个\ndocker rmi nginx:latest\n# 强制删除\ndocker rmi -f myapp:1.0\n# 删除所有无标签镜像\ndocker image prune" },
  { category: "镜像管理", title: "镜像标签", description: "给镜像打标签", code: "docker tag myapp:1.0 registry.example.com/myapp:1.0" },
  { category: "镜像管理", title: "推送镜像", description: "推送镜像到仓库", code: "# 登录\ndocker login registry.example.com\n# 推送\ndocker push registry.example.com/myapp:1.0" },
  { category: "镜像管理", title: "导出/导入镜像", description: "镜像备份与恢复", code: "# 导出\ndocker save -o myapp.tar myapp:1.0\n# 导入\ndocker load -i myapp.tar" },

  // 容器生命周期
  { category: "容器生命周期", title: "运行容器", description: "创建并启动容器", code: "# 基本运行\ndocker run -d --name myapp nginx\n# 端口映射\ndocker run -d -p 8080:80 nginx\n# 环境变量\ndocker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql:8\n# 挂载目录\ndocker run -d -v /host/path:/container/path nginx\n# 限制资源\ndocker run -d --memory=512m --cpus=1 myapp" },
  { category: "容器生命周期", title: "启动/停止容器", description: "管理容器状态", code: "docker start myapp\ndocker stop myapp\ndocker restart myapp" },
  { category: "容器生命周期", title: "删除容器", description: "删除已停止的容器", code: "# 删除单个\ndocker rm myapp\n# 强制删除运行中的\ndocker rm -f myapp\n# 删除所有已停止容器\ndocker container prune" },
  { category: "容器生命周期", title: "进入容器", description: "在运行中的容器内执行命令", code: "# 进入 bash\ndocker exec -it myapp bash\n# 进入 sh\ndocker exec -it myapp sh\n# 执行单条命令\ndocker exec myapp ls /app" },
  { category: "容器生命周期", title: "复制文件", description: "容器与宿主机间复制文件", code: "# 从容器复制到宿主机\ndocker cp myapp:/app/log.txt ./log.txt\n# 从宿主机复制到容器\ndocker cp ./config.yml myapp:/app/config.yml" },

  // 容器信息
  { category: "容器信息", title: "查看运行中容器", description: "列出正在运行的容器", code: "# 运行中的\ndocker ps\n# 所有容器\ndocker ps -a\n# 只显示 ID\ndocker ps -q" },
  { category: "容器信息", title: "查看日志", description: "查看容器输出日志", code: "# 全部日志\ndocker logs myapp\n# 实时跟踪\ndocker logs -f myapp\n# 最后 100 行\ndocker logs --tail 100 myapp\n# 带时间戳\ndocker logs -t myapp" },
  { category: "容器信息", title: "查看资源占用", description: "实时监控容器资源使用", code: "# 所有容器\ndocker stats\n# 指定容器\ndocker stats myapp" },
  { category: "容器信息", title: "查看详细信息", description: "查看容器/镜像的详细配置", code: "# 容器详情\ndocker inspect myapp\n# 获取 IP 地址\ndocker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' myapp" },
  { category: "容器信息", title: "查看端口映射", description: "查看容器的端口映射关系", code: "docker port myapp" },

  // 网络
  { category: "网络", title: "创建网络", description: "创建 Docker 网络", code: "# 创建桥接网络\ndocker network create mynet\n# 指定子网\ndocker network create --subnet=172.20.0.0/16 mynet" },
  { category: "网络", title: "连接网络", description: "将容器加入/移出网络", code: "# 运行时指定网络\ndocker run -d --network mynet --name myapp nginx\n# 已运行容器加入网络\ndocker network connect mynet myapp\n# 断开网络\ndocker network disconnect mynet myapp" },
  { category: "网络", title: "查看网络", description: "列出和检查网络", code: "docker network ls\ndocker network inspect mynet" },

  // 数据卷
  { category: "数据卷", title: "创建数据卷", description: "创建持久化数据卷", code: "docker volume create mydata" },
  { category: "数据卷", title: "使用数据卷", description: "挂载数据卷到容器", code: "# 命名卷\ndocker run -d -v mydata:/var/lib/mysql mysql:8\n# 绑定挂载（宿主机目录）\ndocker run -d -v $(pwd)/data:/app/data myapp\n# 只读挂载\ndocker run -d -v mydata:/data:ro myapp" },
  { category: "数据卷", title: "查看/删除数据卷", description: "管理数据卷", code: "# 列出所有\ndocker volume ls\n# 查看详情\ndocker volume inspect mydata\n# 删除\ndocker volume rm mydata\n# 清理未使用的\ndocker volume prune" },

  // Docker Compose
  { category: "Docker Compose", title: "启动服务", description: "启动 docker-compose.yml 中的所有服务", code: "# 后台启动\ndocker compose up -d\n# 启动并构建\ndocker compose up -d --build\n# 指定文件\ndocker compose -f docker-compose.prod.yml up -d" },
  { category: "Docker Compose", title: "停止服务", description: "停止和删除 Compose 服务", code: "# 停止\ndocker compose stop\n# 停止并删除容器、网络\ndocker compose down\n# 同时删除数据卷\ndocker compose down -v" },
  { category: "Docker Compose", title: "查看状态/日志", description: "查看 Compose 服务状态", code: "# 服务状态\ndocker compose ps\n# 查看日志\ndocker compose logs -f\n# 指定服务日志\ndocker compose logs -f web" },
  { category: "Docker Compose", title: "示例 Compose 文件", description: "常见的 docker-compose.yml 结构", code: "version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - '3000:3000'\n    environment:\n      - NODE_ENV=production\n    depends_on:\n      - db\n    restart: always\n\n  db:\n    image: mysql:8\n    environment:\n      MYSQL_ROOT_PASSWORD: 123456\n      MYSQL_DATABASE: myapp\n    volumes:\n      - db_data:/var/lib/mysql\n    ports:\n      - '3306:3306'\n\nvolumes:\n  db_data:" },
  { category: "Docker Compose", title: "扩缩容", description: "调整服务实例数", code: "docker compose up -d --scale web=3" },

  // Dockerfile
  { category: "Dockerfile", title: "基础 Dockerfile", description: "Node.js 应用的 Dockerfile 示例", code: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]" },
  { category: "Dockerfile", title: "多阶段构建", description: "减小镜像体积的多阶段构建", code: "# 构建阶段\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# 运行阶段\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD [\"node\", \"dist/main.js\"]" },
  { category: "Dockerfile", title: "Java 应用 Dockerfile", description: "Spring Boot 应用的 Dockerfile", code: "FROM eclipse-temurin:17-jre-alpine\nWORKDIR /app\nCOPY target/*.jar app.jar\nEXPOSE 8080\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]" },
  { category: "Dockerfile", title: ".dockerignore", description: "排除不需要的文件", code: "node_modules\n.git\n.env\n*.md\nDockerfile\ndocker-compose.yml\n.next\ndist" },

  // 清理维护
  { category: "清理维护", title: "全面清理", description: "清理所有未使用的资源", code: "# 清理未使用的镜像、容器、网络、卷\ndocker system prune -a --volumes" },
  { category: "清理维护", title: "查看磁盘占用", description: "查看 Docker 磁盘使用情况", code: "docker system df\n# 详细列表\ndocker system df -v" },
];

export default function DockerCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Docker 速查手册"
        subtitle="Docker 镜像、容器、网络、Compose、Dockerfile 常用操作速查"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
