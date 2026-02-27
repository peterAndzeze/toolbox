import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kubernetes 命令速查 - kubectl 全命令参考",
  description: "Kubernetes kubectl 全命令速查手册，涵盖 Pod、Deployment、Service、ConfigMap、Namespace、RBAC 等常用操作，支持搜索和一键复制。",
  keywords: ["Kubernetes", "kubectl", "K8s命令", "容器编排", "速查手册"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
