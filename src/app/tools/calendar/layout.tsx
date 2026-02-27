import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "万年历/黄历 - 农历公历对照查询",
  description: "在线万年历，公历农历日期对照，节假日查询，二十四节气，老黄历宜忌查询。",
  keywords: ["万年历", "黄历", "农历", "公历农历转换", "节气", "宜忌"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
