"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["1xx 信息", "2xx 成功", "3xx 重定向", "4xx 客户端错误", "5xx 服务器错误"];

const items: CheatItem[] = [
  // 1xx
  { category: "1xx 信息", title: "100 Continue", description: "服务器已收到请求头，客户端应继续发送请求体", code: "状态码: 100 Continue\n\n含义: 服务器已接收请求头部分，客户端可以继续发送请求体。\n常见于: 大文件上传前的预检。" },
  { category: "1xx 信息", title: "101 Switching Protocols", description: "服务器同意切换协议（如 WebSocket）", code: "状态码: 101 Switching Protocols\n\n含义: 服务器同意客户端的协议切换请求。\n常见于: HTTP 升级为 WebSocket 连接。\n\n响应头示例:\nUpgrade: websocket\nConnection: Upgrade" },

  // 2xx
  { category: "2xx 成功", title: "200 OK", description: "请求成功，服务器返回了请求的数据", code: "状态码: 200 OK\n\n含义: 请求成功。\n\nGET  → 返回请求的资源\nPOST → 返回处理结果\nPUT  → 返回更新后的资源" },
  { category: "2xx 成功", title: "201 Created", description: "请求成功，服务器创建了新资源", code: "状态码: 201 Created\n\n含义: 资源创建成功。\n常见于: POST 请求创建新用户、新文章等。\n\n响应通常包含:\nLocation: /api/users/123  (新资源的URL)" },
  { category: "2xx 成功", title: "204 No Content", description: "请求成功，但没有返回内容", code: "状态码: 204 No Content\n\n含义: 请求成功处理，但不需要返回内容。\n常见于: DELETE 删除成功、PUT 更新成功。" },

  // 3xx
  { category: "3xx 重定向", title: "301 Moved Permanently", description: "资源已永久移动到新 URL", code: "状态码: 301 Moved Permanently\n\n含义: 资源已永久转移，以后都用新 URL。\n搜索引擎会更新索引到新 URL。\n\n响应头:\nLocation: https://new-domain.com/page\n\nNginx 配置:\nreturn 301 https://new-domain.com$request_uri;" },
  { category: "3xx 重定向", title: "302 Found", description: "资源临时移动到新 URL", code: "状态码: 302 Found\n\n含义: 资源临时重定向，下次还用原 URL。\n常见于: 登录后跳转、临时维护。\n\n响应头:\nLocation: /login" },
  { category: "3xx 重定向", title: "304 Not Modified", description: "资源未修改，使用浏览器缓存", code: "状态码: 304 Not Modified\n\n含义: 资源没有变化，直接用本地缓存。\n节省带宽，加快页面加载。\n\n相关请求头:\nIf-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT\nIf-None-Match: \"33a64df551425fcc55e4d42a148795d9\"" },
  { category: "3xx 重定向", title: "307 Temporary Redirect", description: "临时重定向，保持原请求方法", code: "状态码: 307 Temporary Redirect\n\n含义: 临时重定向（保持 POST/PUT 等方法不变）。\n与 302 的区别: 307 保证不会把 POST 改成 GET。" },
  { category: "3xx 重定向", title: "308 Permanent Redirect", description: "永久重定向，保持原请求方法", code: "状态码: 308 Permanent Redirect\n\n含义: 永久重定向（保持原始请求方法）。\n与 301 的区别: 308 保证不会把 POST 改成 GET。" },

  // 4xx
  { category: "4xx 客户端错误", title: "400 Bad Request", description: "请求格式错误，服务器无法理解", code: "状态码: 400 Bad Request\n\n含义: 请求有语法错误或参数无效。\n\n常见原因:\n- JSON 格式错误\n- 缺少必填参数\n- 参数类型不对\n- URL 格式错误" },
  { category: "4xx 客户端错误", title: "401 Unauthorized", description: "未认证，需要登录", code: "状态码: 401 Unauthorized\n\n含义: 请求需要身份认证。\n\n常见原因:\n- 未携带 Token\n- Token 已过期\n- Token 无效\n\n响应头通常包含:\nWWW-Authenticate: Bearer" },
  { category: "4xx 客户端错误", title: "403 Forbidden", description: "已认证但没有权限访问", code: "状态码: 403 Forbidden\n\n含义: 服务器理解请求，但拒绝执行。\n\n401 vs 403:\n401 = 你是谁？（未登录）\n403 = 我知道你是谁，但你没权限。" },
  { category: "4xx 客户端错误", title: "404 Not Found", description: "请求的资源不存在", code: "状态码: 404 Not Found\n\n含义: 服务器找不到请求的资源。\n\n常见原因:\n- URL 路径拼错\n- 资源已被删除\n- 路由未定义" },
  { category: "4xx 客户端错误", title: "405 Method Not Allowed", description: "请求方法不被允许", code: "状态码: 405 Method Not Allowed\n\n含义: 该 URL 不支持当前请求方法。\n例如: 对只支持 GET 的接口发了 POST。\n\n响应头:\nAllow: GET, HEAD" },
  { category: "4xx 客户端错误", title: "409 Conflict", description: "请求与当前资源状态冲突", code: "状态码: 409 Conflict\n\n含义: 请求与服务器当前状态冲突。\n常见于: 用户名已存在、版本冲突。" },
  { category: "4xx 客户端错误", title: "413 Payload Too Large", description: "请求体超出服务器限制", code: "状态码: 413 Payload Too Large\n\n含义: 请求体太大，超过服务器限制。\n常见于: 上传大文件。\n\nNginx 调大限制:\nclient_max_body_size 100M;" },
  { category: "4xx 客户端错误", title: "422 Unprocessable Entity", description: "请求格式正确但语义错误", code: "状态码: 422 Unprocessable Entity\n\n含义: 请求语法正确，但内容无法被处理。\n常见于: 表单验证失败（邮箱格式不对等）。\n\n与 400 的区别:\n400 = 格式都不对\n422 = 格式对了但内容不对" },
  { category: "4xx 客户端错误", title: "429 Too Many Requests", description: "请求频率超过限制", code: "状态码: 429 Too Many Requests\n\n含义: 客户端发送请求过多（限流）。\n\n响应头通常包含:\nRetry-After: 60  (60秒后重试)" },

  // 5xx
  { category: "5xx 服务器错误", title: "500 Internal Server Error", description: "服务器内部错误", code: "状态码: 500 Internal Server Error\n\n含义: 服务器遇到未知错误，无法完成请求。\n\n常见原因:\n- 代码抛出未捕获的异常\n- 数据库连接失败\n- 空指针异常\n- 配置文件错误" },
  { category: "5xx 服务器错误", title: "502 Bad Gateway", description: "网关/代理从上游收到无效响应", code: "状态码: 502 Bad Gateway\n\n含义: 反向代理收到上游服务器的无效响应。\n\n常见原因:\n- 后端服务挂了\n- 后端服务正在重启\n- Nginx 代理配置错误" },
  { category: "5xx 服务器错误", title: "503 Service Unavailable", description: "服务暂时不可用", code: "状态码: 503 Service Unavailable\n\n含义: 服务器暂时无法处理请求。\n\n常见原因:\n- 服务器过载\n- 正在维护\n- 数据库连接池耗尽\n\n响应头:\nRetry-After: 300" },
  { category: "5xx 服务器错误", title: "504 Gateway Timeout", description: "网关/代理等待上游响应超时", code: "状态码: 504 Gateway Timeout\n\n含义: 反向代理等待上游服务器响应超时。\n\n常见原因:\n- 后端处理时间太长\n- 网络问题\n\nNginx 调大超时:\nproxy_read_timeout 300s;" },
];

export default function HttpStatusPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="HTTP 状态码查询"
        subtitle="HTTP 状态码完整参考，包含含义、使用场景和常见原因"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
