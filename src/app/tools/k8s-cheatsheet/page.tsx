"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = [
  "集群信息",
  "Namespace",
  "Pod 管理",
  "Deployment",
  "Service",
  "ConfigMap & Secret",
  "持久化存储",
  "Ingress",
  "Job & CronJob",
  "RBAC 权限",
  "节点管理",
  "日志与调试",
  "Helm",
];

const items: CheatItem[] = [
  // 集群信息
  {
    category: "集群信息",
    title: "查看集群信息",
    description: "显示集群 Master 和服务的端点地址",
    code: "kubectl cluster-info",
  },
  {
    category: "集群信息",
    title: "查看 API 版本",
    description: "列出集群支持的 API 版本列表",
    code: "kubectl api-versions",
  },
  {
    category: "集群信息",
    title: "查看 API 资源",
    description: "列出集群中可用的 API 资源类型",
    code: "kubectl api-resources",
  },
  {
    category: "集群信息",
    title: "查看组件状态",
    description: "查看集群控制平面组件（scheduler、controller-manager 等）状态",
    code: "kubectl get componentstatuses",
  },
  {
    category: "集群信息",
    title: "查看当前上下文",
    description: "显示当前使用的 kubeconfig 上下文",
    code: "kubectl config current-context",
  },
  {
    category: "集群信息",
    title: "切换上下文",
    description: "切换到指定的集群上下文",
    code: "kubectl config use-context <context-name>",
  },
  {
    category: "集群信息",
    title: "查看所有上下文",
    description: "列出所有可用的 kubeconfig 上下文",
    code: "kubectl config get-contexts",
  },
  {
    category: "集群信息",
    title: "设置默认命名空间",
    description: "为当前上下文设置默认命名空间",
    code: "kubectl config set-context --current --namespace=xxx",
  },

  // Namespace
  {
    category: "Namespace",
    title: "查看命名空间",
    description: "列出集群中所有命名空间",
    code: "kubectl get namespaces\n# 简写\nkubectl get ns",
  },
  {
    category: "Namespace",
    title: "创建命名空间",
    description: "创建新的命名空间",
    code: "kubectl create namespace <name>\n# 简写\nkubectl create ns <name>",
  },
  {
    category: "Namespace",
    title: "删除命名空间",
    description: "删除指定命名空间及其下所有资源",
    code: "kubectl delete namespace <name>\nkubectl delete ns <name>",
  },

  // Pod 管理
  {
    category: "Pod 管理",
    title: "查看 Pod 列表",
    description: "列出 Pod，支持多种输出格式和命名空间",
    code: "kubectl get pods\n# 显示更多列（节点、IP 等）\nkubectl get pods -o wide\n# 所有命名空间\nkubectl get pods --all-namespaces\n# 指定命名空间\nkubectl get pods -n <namespace>",
  },
  {
    category: "Pod 管理",
    title: "查看 Pod 详情",
    description: "显示 Pod 的详细配置、事件和状态",
    code: "kubectl describe pod <pod-name>\nkubectl describe pod <pod-name> -n <namespace>",
  },
  {
    category: "Pod 管理",
    title: "创建 Pod",
    description: "使用 run 命令快速创建单容器 Pod",
    code: "kubectl run nginx --image=nginx\nkubectl run nginx --image=nginx --port=80\nkubectl run nginx --image=nginx --restart=Never",
  },
  {
    category: "Pod 管理",
    title: "删除 Pod",
    description: "删除指定 Pod",
    code: "kubectl delete pod <pod-name>\nkubectl delete pod <pod-name> -n <namespace>\n# 强制删除\nkubectl delete pod <pod-name> --force --grace-period=0",
  },
  {
    category: "Pod 管理",
    title: "进入容器",
    description: "在运行中的 Pod 容器内执行命令",
    code: "kubectl exec -it <pod-name> -- bash\nkubectl exec -it <pod-name> -c <container-name> -- sh\n# 执行单条命令\nkubectl exec <pod-name> -- ls /app",
  },
  {
    category: "Pod 管理",
    title: "端口转发",
    description: "将本地端口转发到 Pod 端口，用于本地访问",
    code: "kubectl port-forward pod/<pod-name> 8080:80\nkubectl port-forward svc/<svc-name> 8080:80 -n <namespace>",
  },
  {
    category: "Pod 管理",
    title: "复制文件",
    description: "在 Pod 与本地之间复制文件",
    code: "# 从 Pod 复制到本地\nkubectl cp <namespace>/<pod-name>:/path/file ./local-file\n# 从本地复制到 Pod\nkubectl cp ./local-file <namespace>/<pod-name>:/path/file",
  },
  {
    category: "Pod 管理",
    title: "查看 Pod 资源使用",
    description: "显示 Pod 的 CPU 和内存使用量（需 metrics-server）",
    code: "kubectl top pod\nkubectl top pod -n <namespace>\nkubectl top pod --sort-by=cpu",
  },

  // Deployment
  {
    category: "Deployment",
    title: "创建 Deployment",
    description: "创建 Deployment 工作负载",
    code: "kubectl create deployment nginx --image=nginx\nkubectl create deployment nginx --image=nginx --replicas=3",
  },
  {
    category: "Deployment",
    title: "查看 Deployment",
    description: "列出 Deployment 及其副本状态",
    code: "kubectl get deployments\nkubectl get deploy\nkubectl get deploy -o wide",
  },
  {
    category: "Deployment",
    title: "更新镜像",
    description: "更新 Deployment 中容器的镜像版本",
    code: "kubectl set image deployment/<name> <container>=<image>:<tag>\nkubectl set image deployment/nginx nginx=nginx:1.25",
  },
  {
    category: "Deployment",
    title: "扩缩容",
    description: "调整 Deployment 的副本数量",
    code: "kubectl scale deployment <name> --replicas=5\nkubectl scale deploy nginx --replicas=3",
  },
  {
    category: "Deployment",
    title: "自动扩缩容 HPA",
    description: "创建水平 Pod 自动扩缩容",
    code: "kubectl autoscale deployment <name> --min=2 --max=10 --cpu-percent=80",
  },
  {
    category: "Deployment",
    title: "回滚",
    description: "回滚到上一个或指定版本",
    code: "kubectl rollout undo deployment/<name>\nkubectl rollout undo deployment/nginx --to-revision=2",
  },
  {
    category: "Deployment",
    title: "查看发布历史",
    description: "查看 Deployment 的滚动更新历史",
    code: "kubectl rollout history deployment/<name>\nkubectl rollout history deployment/nginx --revision=2",
  },
  {
    category: "Deployment",
    title: "暂停/恢复发布",
    description: "暂停或恢复 Deployment 的滚动更新",
    code: "kubectl rollout pause deployment/<name>\nkubectl rollout resume deployment/<name>",
  },
  {
    category: "Deployment",
    title: "重启 Deployment",
    description: "重启 Deployment 触发滚动更新",
    code: "kubectl rollout restart deployment/<name>",
  },

  // Service
  {
    category: "Service",
    title: "创建 Service",
    description: "为 Deployment 或 Pod 创建 Service",
    code: "kubectl expose deployment nginx --port=80 --target-port=80\nkubectl expose pod nginx --port=80 --name=nginx-svc",
  },
  {
    category: "Service",
    title: "查看 Service",
    description: "列出 Service 及其 ClusterIP、端口",
    code: "kubectl get svc\nkubectl get services\nkubectl get svc -o wide",
  },
  {
    category: "Service",
    title: "查看 Endpoints",
    description: "查看 Service 背后的 Pod IP 列表",
    code: "kubectl get endpoints\nkubectl get ep",
  },
  {
    category: "Service",
    title: "删除 Service",
    description: "删除指定 Service",
    code: "kubectl delete svc <service-name>\nkubectl delete service nginx -n <namespace>",
  },

  // ConfigMap & Secret
  {
    category: "ConfigMap & Secret",
    title: "创建 ConfigMap（literal）",
    description: "从字面量创建 ConfigMap",
    code: "kubectl create configmap my-config --from-literal=key1=value1 --from-literal=key2=value2",
  },
  {
    category: "ConfigMap & Secret",
    title: "创建 ConfigMap（from file）",
    description: "从文件或目录创建 ConfigMap",
    code: "kubectl create configmap my-config --from-file=config.yml\nkubectl create configmap my-config --from-file=dir/",
  },
  {
    category: "ConfigMap & Secret",
    title: "查看 ConfigMap",
    description: "列出和查看 ConfigMap 详情",
    code: "kubectl get configmaps\nkubectl get cm\nkubectl describe configmap <name>",
  },
  {
    category: "ConfigMap & Secret",
    title: "创建 Secret（generic）",
    description: "创建通用 Secret",
    code: "kubectl create secret generic my-secret --from-literal=password=xxx\nkubectl create secret generic my-secret --from-file=./secret.txt",
  },
  {
    category: "ConfigMap & Secret",
    title: "创建 Secret（tls）",
    description: "创建 TLS 证书 Secret",
    code: "kubectl create secret tls my-tls --cert=path/tls.crt --key=path/tls.key",
  },
  {
    category: "ConfigMap & Secret",
    title: "创建 Secret（docker-registry）",
    description: "创建镜像拉取凭证 Secret",
    code: "kubectl create secret docker-registry regcred --docker-server=registry.example.com --docker-username=user --docker-password=pass",
  },
  {
    category: "ConfigMap & Secret",
    title: "查看 Secret",
    description: "列出 Secret，Base64 解码查看内容",
    code: "kubectl get secrets\nkubectl get secret <name> -o yaml\n# 解码 base64\necho '<base64-value>' | base64 -d",
  },

  // 持久化存储
  {
    category: "持久化存储",
    title: "PersistentVolume",
    description: "查看集群中的 PV 资源",
    code: "kubectl get pv\nkubectl describe pv <pv-name>",
  },
  {
    category: "持久化存储",
    title: "PersistentVolumeClaim",
    description: "查看 PVC 及其绑定状态",
    code: "kubectl get pvc\nkubectl get pvc -n <namespace>\nkubectl describe pvc <pvc-name>",
  },
  {
    category: "持久化存储",
    title: "StorageClass",
    description: "查看存储类",
    code: "kubectl get sc\nkubectl get storageclass\nkubectl describe storageclass <name>",
  },

  // Ingress
  {
    category: "Ingress",
    title: "查看 Ingress",
    description: "列出 Ingress 资源",
    code: "kubectl get ingress\nkubectl get ing\nkubectl describe ingress <name>",
  },
  {
    category: "Ingress",
    title: "创建 Ingress",
    description: "创建 Ingress 定义路由规则",
    code: "kubectl create ingress example --rule='example.com/=svc:80'\nkubectl create ingress example --rule='foo.com/bar=svc:8080'",
  },

  // Job & CronJob
  {
    category: "Job & CronJob",
    title: "创建 Job",
    description: "创建一次性任务 Job",
    code: "kubectl create job my-job --image=busybox -- echo hello\nkubectl create job my-job --from=cronjob/my-cronjob",
  },
  {
    category: "Job & CronJob",
    title: "查看 Job",
    description: "列出 Job 及其完成状态",
    code: "kubectl get jobs\nkubectl get job <name> -o yaml",
  },
  {
    category: "Job & CronJob",
    title: "创建 CronJob",
    description: "创建定时任务 CronJob",
    code: "kubectl create cronjob my-cron --image=busybox --schedule='*/1 * * * *' -- echo hello",
  },
  {
    category: "Job & CronJob",
    title: "查看 CronJob",
    description: "列出 CronJob",
    code: "kubectl get cronjobs\nkubectl get cj",
  },

  // RBAC 权限
  {
    category: "RBAC 权限",
    title: "查看 ClusterRole",
    description: "列出集群级别的角色",
    code: "kubectl get clusterroles\nkubectl describe clusterrole <name>",
  },
  {
    category: "RBAC 权限",
    title: "创建 Role",
    description: "创建命名空间级别的 Role",
    code: "kubectl create role pod-reader --verb=get,list,watch --resource=pods",
  },
  {
    category: "RBAC 权限",
    title: "创建 RoleBinding",
    description: "将 Role 绑定到用户或组",
    code: "kubectl create rolebinding read-pods --role=pod-reader --user=user1 --namespace=default",
  },
  {
    category: "RBAC 权限",
    title: "创建 ClusterRoleBinding",
    description: "将 ClusterRole 绑定到用户或组",
    code: "kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=user1",
  },
  {
    category: "RBAC 权限",
    title: "检查权限",
    description: "检查当前用户是否具有某操作的权限",
    code: "kubectl auth can-i create pods\nkubectl auth can-i --list\nkubectl auth can-i create pods --as=user1",
  },

  // 节点管理
  {
    category: "节点管理",
    title: "查看节点",
    description: "列出集群节点及其状态",
    code: "kubectl get nodes\nkubectl get nodes -o wide",
  },
  {
    category: "节点管理",
    title: "查看节点详情",
    description: "显示节点的详细配置和资源",
    code: "kubectl describe node <node-name>",
  },
  {
    category: "节点管理",
    title: "标记节点不可调度",
    description: "将节点标记为不可调度（维护前）",
    code: "kubectl cordon <node-name>",
  },
  {
    category: "节点管理",
    title: "恢复节点调度",
    description: "取消 cordon，恢复节点调度",
    code: "kubectl uncordon <node-name>",
  },
  {
    category: "节点管理",
    title: "驱逐节点上的 Pod",
    description: "排空节点，将 Pod 迁移到其他节点",
    code: "kubectl drain <node-name>\nkubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data",
  },
  {
    category: "节点管理",
    title: "给节点打标签",
    description: "为节点添加或修改标签",
    code: "kubectl label node <node-name> disk=ssd\nkubectl label node <node-name> disk-",
  },
  {
    category: "节点管理",
    title: "给节点打污点",
    description: "为节点添加污点，控制 Pod 调度",
    code: "kubectl taint nodes <node-name> key=value:NoSchedule\nkubectl taint nodes <node-name> key:NoSchedule-",
  },
  {
    category: "节点管理",
    title: "查看节点资源使用",
    description: "显示节点的 CPU 和内存使用量",
    code: "kubectl top node\nkubectl top node --sort-by=memory",
  },

  // 日志与调试
  {
    category: "日志与调试",
    title: "查看日志",
    description: "查看 Pod 容器日志",
    code: "kubectl logs <pod-name>\nkubectl logs -f <pod-name>\nkubectl logs <pod-name> --previous\nkubectl logs <pod-name> -c <container>\nkubectl logs <pod-name> --tail=100",
  },
  {
    category: "日志与调试",
    title: "查看事件",
    description: "查看集群事件",
    code: "kubectl get events\nkubectl get events -n <namespace> --sort-by='.lastTimestamp'",
  },
  {
    category: "日志与调试",
    title: "运行调试容器",
    description: "在 Pod 中运行临时调试容器",
    code: "kubectl debug <pod-name> -it --image=busybox --target=<container>",
  },
  {
    category: "日志与调试",
    title: "查看资源的 YAML",
    description: "以 YAML 格式输出资源定义",
    code: "kubectl get pod <name> -o yaml\nkubectl get deploy <name> -o yaml",
  },
  {
    category: "日志与调试",
    title: "试运行",
    description: "模拟应用配置，不实际执行",
    code: "kubectl apply --dry-run=client -o yaml -f deployment.yaml\nkubectl apply --dry-run=server -f deployment.yaml",
  },
  {
    category: "日志与调试",
    title: "解释资源字段",
    description: "查看资源类型的字段说明",
    code: "kubectl explain pod\nkubectl explain pod.spec.containers",
  },

  // Helm
  {
    category: "Helm",
    title: "添加仓库",
    description: "添加 Helm Chart 仓库",
    code: "helm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update",
  },
  {
    category: "Helm",
    title: "搜索 Chart",
    description: "在仓库中搜索 Chart",
    code: "helm search repo nginx\nhelm search repo bitnami/nginx",
  },
  {
    category: "Helm",
    title: "安装 Chart",
    description: "安装 Helm Release",
    code: "helm install my-nginx bitnami/nginx\nhelm install my-nginx bitnami/nginx -f values.yaml\nhelm install my-nginx bitnami/nginx --set replicaCount=3",
  },
  {
    category: "Helm",
    title: "查看 Release",
    description: "列出已安装的 Helm Release",
    code: "helm list\nhelm list -A\nhelm list --all",
  },
  {
    category: "Helm",
    title: "升级 Release",
    description: "升级 Helm Release 到新版本或配置",
    code: "helm upgrade my-nginx bitnami/nginx\nhelm upgrade my-nginx bitnami/nginx -f values.yaml",
  },
  {
    category: "Helm",
    title: "回滚 Release",
    description: "回滚 Helm Release 到指定版本",
    code: "helm rollback my-nginx\nhelm rollback my-nginx 2",
  },
  {
    category: "Helm",
    title: "卸载 Release",
    description: "卸载 Helm Release",
    code: "helm uninstall my-nginx\nhelm uninstall my-nginx --keep-history",
  },
  {
    category: "Helm",
    title: "查看 values",
    description: "查看 Chart 的默认 values",
    code: "helm show values bitnami/nginx\nhelm get values my-nginx",
  },
];

export default function K8sCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Kubernetes 命令速查"
        subtitle="kubectl 全命令速查手册，涵盖集群管理、工作负载、网络、存储、安全等，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
