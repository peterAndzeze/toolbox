"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["Nacos 服务注册", "Nacos 配置中心", "OpenFeign 远程调用", "Gateway 网关", "Sentinel 限流熔断", "Seata 分布式事务", "Spring Cloud Stream", "链路追踪", "常用依赖"];

const items: CheatItem[] = [
  // Nacos 注册
  { category: "Nacos 服务注册", title: "引入依赖", description: "添加 Nacos 服务发现依赖", code: "<dependency>\n    <groupId>com.alibaba.cloud</groupId>\n    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>\n</dependency>" },
  { category: "Nacos 服务注册", title: "配置注册中心", description: "配置 Nacos 服务器地址", code: "spring:\n  application:\n    name: order-service\n  cloud:\n    nacos:\n      discovery:\n        server-addr: 127.0.0.1:8848\n        namespace: dev\n        group: DEFAULT_GROUP" },
  { category: "Nacos 服务注册", title: "启用服务发现", description: "主类启用注解", code: "@SpringBootApplication\n@EnableDiscoveryClient\npublic class OrderApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(OrderApplication.class, args);\n    }\n}" },

  // Nacos 配置
  { category: "Nacos 配置中心", title: "引入依赖", description: "添加 Nacos 配置中心依赖", code: "<dependency>\n    <groupId>com.alibaba.cloud</groupId>\n    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>\n</dependency>\n<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-bootstrap</artifactId>\n</dependency>" },
  { category: "Nacos 配置中心", title: "bootstrap 配置", description: "bootstrap.yml 连接配置中心", code: "# bootstrap.yml\nspring:\n  application:\n    name: order-service\n  cloud:\n    nacos:\n      config:\n        server-addr: 127.0.0.1:8848\n        file-extension: yaml\n        namespace: dev\n        group: DEFAULT_GROUP\n        # 共享配置\n        shared-configs:\n          - data-id: common.yaml\n            refresh: true" },
  { category: "Nacos 配置中心", title: "动态刷新", description: "配置动态刷新", code: "@RestController\n@RefreshScope\npublic class ConfigController {\n\n    @Value(\"${app.switch.enabled:false}\")\n    private boolean switchEnabled;\n\n    @GetMapping(\"/config\")\n    public boolean getConfig() {\n        return switchEnabled;\n    }\n}" },

  // OpenFeign
  { category: "OpenFeign 远程调用", title: "引入依赖", description: "添加 OpenFeign 依赖", code: "<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-openfeign</artifactId>\n</dependency>\n<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-loadbalancer</artifactId>\n</dependency>" },
  { category: "OpenFeign 远程调用", title: "启用 Feign", description: "主类启用 FeignClients", code: "@SpringBootApplication\n@EnableFeignClients\npublic class OrderApplication { }" },
  { category: "OpenFeign 远程调用", title: "定义 Feign 接口", description: "声明式远程调用接口", code: "@FeignClient(name = \"user-service\", fallbackFactory = UserClientFallback.class)\npublic interface UserClient {\n\n    @GetMapping(\"/api/users/{id}\")\n    User getById(@PathVariable(\"id\") Long id);\n\n    @PostMapping(\"/api/users\")\n    User create(@RequestBody UserDTO dto);\n}" },
  { category: "OpenFeign 远程调用", title: "降级处理", description: "Feign 调用失败的兜底", code: "@Component\npublic class UserClientFallback implements FallbackFactory<UserClient> {\n    @Override\n    public UserClient create(Throwable cause) {\n        return new UserClient() {\n            @Override\n            public User getById(Long id) {\n                return new User(id, \"未知用户\");\n            }\n            @Override\n            public User create(UserDTO dto) {\n                throw new RuntimeException(\"服务不可用\");\n            }\n        };\n    }\n}" },
  { category: "OpenFeign 远程调用", title: "Feign 配置", description: "超时、日志等配置", code: "feign:\n  client:\n    config:\n      default:\n        connect-timeout: 5000\n        read-timeout: 10000\n        logger-level: BASIC\n  compression:\n    request:\n      enabled: true\n    response:\n      enabled: true" },

  // Gateway
  { category: "Gateway 网关", title: "引入依赖", description: "添加 Gateway 依赖", code: "<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-gateway</artifactId>\n</dependency>" },
  { category: "Gateway 网关", title: "路由配置", description: "配置路由转发规则", code: "spring:\n  cloud:\n    gateway:\n      routes:\n        - id: user-service\n          uri: lb://user-service\n          predicates:\n            - Path=/api/users/**\n          filters:\n            - StripPrefix=0\n\n        - id: order-service\n          uri: lb://order-service\n          predicates:\n            - Path=/api/orders/**" },
  { category: "Gateway 网关", title: "全局过滤器", description: "自定义全局过滤器（如鉴权）", code: "@Component\npublic class AuthFilter implements GlobalFilter, Ordered {\n\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {\n        String token = exchange.getRequest().getHeaders().getFirst(\"Authorization\");\n        if (token == null || token.isEmpty()) {\n            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);\n            return exchange.getResponse().setComplete();\n        }\n        return chain.filter(exchange);\n    }\n\n    @Override\n    public int getOrder() { return 0; }\n}" },
  { category: "Gateway 网关", title: "跨域配置", description: "Gateway 全局跨域设置", code: "spring:\n  cloud:\n    gateway:\n      globalcors:\n        cors-configurations:\n          '[/**]':\n            allowedOrigins: \"*\"\n            allowedMethods: \"*\"\n            allowedHeaders: \"*\"" },

  // Sentinel
  { category: "Sentinel 限流熔断", title: "引入依赖", description: "添加 Sentinel 依赖", code: "<dependency>\n    <groupId>com.alibaba.cloud</groupId>\n    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>\n</dependency>" },
  { category: "Sentinel 限流熔断", title: "连接控制台", description: "配置 Sentinel Dashboard", code: "spring:\n  cloud:\n    sentinel:\n      transport:\n        dashboard: 127.0.0.1:8080\n        port: 8719" },
  { category: "Sentinel 限流熔断", title: "注解限流", description: "使用注解定义限流规则", code: "@GetMapping(\"/api/orders/{id}\")\n@SentinelResource(value = \"getOrder\",\n    blockHandler = \"getOrderBlock\",\n    fallback = \"getOrderFallback\")\npublic Order getOrder(@PathVariable Long id) {\n    return orderService.findById(id);\n}\n\npublic Order getOrderBlock(Long id, BlockException e) {\n    return new Order(id, \"限流了，请稍后重试\");\n}\n\npublic Order getOrderFallback(Long id, Throwable t) {\n    return new Order(id, \"服务异常，降级处理\");\n}" },

  // Seata
  { category: "Seata 分布式事务", title: "引入依赖", description: "添加 Seata 依赖", code: "<dependency>\n    <groupId>com.alibaba.cloud</groupId>\n    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>\n</dependency>" },
  { category: "Seata 分布式事务", title: "配置 Seata", description: "配置 Seata 服务端地址", code: "seata:\n  application-id: order-service\n  tx-service-group: my_tx_group\n  service:\n    vgroup-mapping:\n      my_tx_group: default\n  registry:\n    type: nacos\n    nacos:\n      server-addr: 127.0.0.1:8848" },
  { category: "Seata 分布式事务", title: "使用全局事务", description: "标注分布式事务入口", code: "@Service\npublic class OrderService {\n\n    @GlobalTransactional(rollbackFor = Exception.class)\n    public void createOrder(OrderDTO dto) {\n        // 1. 扣减库存（远程调用）\n        stockClient.deduct(dto.getProductId(), dto.getCount());\n        // 2. 创建订单（本地）\n        orderMapper.insert(dto);\n        // 3. 扣减余额（远程调用）\n        accountClient.debit(dto.getUserId(), dto.getAmount());\n    }\n}" },

  // Stream
  { category: "Spring Cloud Stream", title: "RabbitMQ 配置", description: "使用 RabbitMQ 作为消息中间件", code: "spring:\n  cloud:\n    stream:\n      binders:\n        rabbit:\n          type: rabbit\n          environment:\n            spring:\n              rabbitmq:\n                host: localhost\n                port: 5672\n      bindings:\n        output:\n          destination: order-events\n          binder: rabbit\n        input:\n          destination: order-events\n          group: payment-group\n          binder: rabbit" },
  { category: "Spring Cloud Stream", title: "发送消息", description: "生产者发送消息", code: "@Service\npublic class OrderEventProducer {\n\n    @Autowired\n    private StreamBridge streamBridge;\n\n    public void sendOrderEvent(OrderEvent event) {\n        streamBridge.send(\"output\", event);\n    }\n}" },
  { category: "Spring Cloud Stream", title: "消费消息", description: "消费者接收消息", code: "@Configuration\npublic class OrderEventConsumer {\n\n    @Bean\n    public Consumer<OrderEvent> input() {\n        return event -> {\n            System.out.println(\"收到订单事件: \" + event);\n            // 处理业务逻辑\n        };\n    }\n}" },

  // 链路追踪
  { category: "链路追踪", title: "Micrometer + Zipkin", description: "分布式链路追踪配置", code: "<dependency>\n    <groupId>io.micrometer</groupId>\n    <artifactId>micrometer-tracing-bridge-brave</artifactId>\n</dependency>\n<dependency>\n    <groupId>io.zipkin.reporter2</groupId>\n    <artifactId>zipkin-reporter-brave</artifactId>\n</dependency>" },
  { category: "链路追踪", title: "追踪配置", description: "配置采样率和 Zipkin 地址", code: "management:\n  tracing:\n    sampling:\n      probability: 1.0\n  zipkin:\n    tracing:\n      endpoint: http://localhost:9411/api/v2/spans" },

  // 常用依赖
  { category: "常用依赖", title: "BOM 版本管理", description: "Spring Cloud Alibaba 版本管理", code: "<dependencyManagement>\n    <dependencies>\n        <dependency>\n            <groupId>org.springframework.cloud</groupId>\n            <artifactId>spring-cloud-dependencies</artifactId>\n            <version>2023.0.0</version>\n            <type>pom</type>\n            <scope>import</scope>\n        </dependency>\n        <dependency>\n            <groupId>com.alibaba.cloud</groupId>\n            <artifactId>spring-cloud-alibaba-dependencies</artifactId>\n            <version>2023.0.0.0</version>\n            <type>pom</type>\n            <scope>import</scope>\n        </dependency>\n    </dependencies>\n</dependencyManagement>" },
  { category: "常用依赖", title: "版本对照表", description: "Spring Boot / Cloud / Alibaba 版本关系", code: "Spring Boot 3.2.x → Spring Cloud 2023.0.x → Alibaba 2023.0.x\nSpring Boot 3.0.x → Spring Cloud 2022.0.x → Alibaba 2022.0.x\nSpring Boot 2.7.x → Spring Cloud 2021.0.x → Alibaba 2021.0.x\nSpring Boot 2.6.x → Spring Cloud 2021.0.x → Alibaba 2021.0.x\n\n注意: Spring Boot 3.x 需要 Java 17+" },
];

export default function SpringCloudCheatSheetPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Spring Cloud 速查手册"
        subtitle="Spring Cloud Alibaba 微服务组件配置速查：Nacos、Feign、Gateway、Sentinel、Seata 等"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
