"use client";

import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { CheatSheet, CheatItem } from "@/components/CheatSheet";

const categories = ["服务器配置", "数据库配置", "JPA / MyBatis", "日志配置", "安全配置", "缓存配置", "常用注解", "异常处理", "AOP 切面", "异步与调度", "测试", "Actuator 监控", "文件上传", "其他配置"];

const items: CheatItem[] = [
  // 服务器配置
  { category: "服务器配置", title: "端口配置", description: "修改默认端口 8080", code: "# application.yml\nserver:\n  port: 9090" },
  { category: "服务器配置", title: "上下文路径", description: "设置应用根路径前缀", code: "server:\n  servlet:\n    context-path: /api" },
  { category: "服务器配置", title: "HTTPS 配置", description: "启用 SSL/HTTPS", code: "server:\n  port: 8443\n  ssl:\n    key-store: classpath:keystore.p12\n    key-store-password: changeit\n    key-store-type: PKCS12" },
  { category: "服务器配置", title: "Gzip 压缩", description: "启用响应压缩减少传输量", code: "server:\n  compression:\n    enabled: true\n    mime-types: application/json,text/html,text/css\n    min-response-size: 1024" },
  { category: "服务器配置", title: "多环境配置", description: "根据环境加载不同配置", code: "# application.yml 中指定激活环境\nspring:\n  profiles:\n    active: dev\n\n# 创建对应文件:\n# application-dev.yml   (开发)\n# application-prod.yml  (生产)\n# application-test.yml  (测试)" },

  // 数据库配置
  { category: "数据库配置", title: "MySQL 数据源", description: "配置 MySQL 数据库连接", code: "spring:\n  datasource:\n    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4\n    username: root\n    password: 123456\n    driver-class-name: com.mysql.cj.jdbc.Driver" },
  { category: "数据库配置", title: "HikariCP 连接池", description: "配置数据库连接池参数", code: "spring:\n  datasource:\n    hikari:\n      maximum-pool-size: 20\n      minimum-idle: 5\n      idle-timeout: 600000\n      connection-timeout: 30000\n      max-lifetime: 1800000" },
  { category: "数据库配置", title: "PostgreSQL 数据源", description: "配置 PostgreSQL 连接", code: "spring:\n  datasource:\n    url: jdbc:postgresql://localhost:5432/mydb\n    username: postgres\n    password: 123456\n    driver-class-name: org.postgresql.Driver" },
  { category: "数据库配置", title: "Redis 配置", description: "配置 Redis 连接", code: "spring:\n  data:\n    redis:\n      host: localhost\n      port: 6379\n      password: your_password\n      database: 0\n      lettuce:\n        pool:\n          max-active: 8\n          max-idle: 8\n          min-idle: 0" },

  // JPA / MyBatis
  { category: "JPA / MyBatis", title: "JPA 配置", description: "Spring Data JPA 基本配置", code: "spring:\n  jpa:\n    hibernate:\n      ddl-auto: update  # none/create/update/validate\n    show-sql: true\n    properties:\n      hibernate:\n        format_sql: true\n        dialect: org.hibernate.dialect.MySQL8Dialect" },
  { category: "JPA / MyBatis", title: "MyBatis 配置", description: "MyBatis 基本配置", code: "mybatis:\n  mapper-locations: classpath:mapper/*.xml\n  type-aliases-package: com.example.entity\n  configuration:\n    map-underscore-to-camel-case: true\n    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl" },
  { category: "JPA / MyBatis", title: "MyBatis-Plus 配置", description: "MyBatis-Plus 增强配置", code: "mybatis-plus:\n  mapper-locations: classpath:mapper/*.xml\n  global-config:\n    db-config:\n      id-type: auto\n      logic-delete-field: deleted\n      logic-delete-value: 1\n      logic-not-delete-value: 0\n  configuration:\n    map-underscore-to-camel-case: true" },

  // 日志配置
  { category: "日志配置", title: "日志级别", description: "设置日志输出级别", code: "logging:\n  level:\n    root: INFO\n    com.example: DEBUG\n    org.springframework.web: WARN\n    org.hibernate.SQL: DEBUG" },
  { category: "日志配置", title: "日志文件", description: "将日志输出到文件", code: "logging:\n  file:\n    name: logs/app.log\n    max-size: 100MB\n    max-history: 30\n  pattern:\n    file: \"%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n\"" },

  // 安全配置
  { category: "安全配置", title: "Spring Security 基本配置", description: "配置认证和授权", code: "@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        http\n            .csrf(csrf -> csrf.disable())\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/public/**\").permitAll()\n                .requestMatchers(\"/api/admin/**\").hasRole(\"ADMIN\")\n                .anyRequest().authenticated()\n            )\n            .sessionManagement(s -> s\n                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)\n            );\n        return http.build();\n    }\n}" },
  { category: "安全配置", title: "CORS 跨域配置", description: "配置跨域访问", code: "@Configuration\npublic class CorsConfig implements WebMvcConfigurer {\n\n    @Override\n    public void addCorsMappings(CorsRegistry registry) {\n        registry.addMapping(\"/api/**\")\n            .allowedOrigins(\"http://localhost:3000\")\n            .allowedMethods(\"GET\", \"POST\", \"PUT\", \"DELETE\")\n            .allowedHeaders(\"*\")\n            .allowCredentials(true)\n            .maxAge(3600);\n    }\n}" },
  { category: "安全配置", title: "JWT 过滤器", description: "自定义 JWT 认证过滤器", code: "public class JwtAuthFilter extends OncePerRequestFilter {\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,\n                                    FilterChain chain) throws ServletException, IOException {\n        String token = extractToken(req);\n        if (token != null && jwtUtil.validateToken(token)) {\n            Authentication auth = jwtUtil.getAuthentication(token);\n            SecurityContextHolder.getContext().setAuthentication(auth);\n        }\n        chain.doFilter(req, res);\n    }\n}" },
  { category: "安全配置", title: "方法级安全", description: "使用 @PreAuthorize 等方法级权限控制", code: "@Configuration\n@EnableMethodSecurity\npublic class MethodSecurityConfig { }\n\n@Service\npublic class UserService {\n    @PreAuthorize(\"hasRole('ADMIN')\")\n    public void deleteUser(Long id) { }\n\n    @PreAuthorize(\"#id == authentication.principal.id\")\n    public User getProfile(Long id) { }\n}" },

  // 缓存配置
  { category: "缓存配置", title: "启用缓存", description: "开启 Spring Cache", code: "# application.yml\nspring:\n  cache:\n    type: redis\n    redis:\n      time-to-live: 3600000  # 1小时\n\n# 主类添加注解\n@SpringBootApplication\n@EnableCaching\npublic class Application { }" },
  { category: "缓存配置", title: "缓存注解", description: "常用缓存注解", code: "@Service\npublic class UserService {\n\n    @Cacheable(value = \"users\", key = \"#id\")\n    public User findById(Long id) { ... }\n\n    @CachePut(value = \"users\", key = \"#user.id\")\n    public User update(User user) { ... }\n\n    @CacheEvict(value = \"users\", key = \"#id\")\n    public void delete(Long id) { ... }\n\n    @CacheEvict(value = \"users\", allEntries = true)\n    public void clearAll() { ... }\n}" },

  // 常用注解
  { category: "常用注解", title: "Controller 注解", description: "Web 层常用注解", code: "@RestController\n@RequestMapping(\"/api/users\")\npublic class UserController {\n\n    @GetMapping            // GET /api/users\n    @GetMapping(\"/{id}\")   // GET /api/users/1\n    @PostMapping           // POST /api/users\n    @PutMapping(\"/{id}\")   // PUT /api/users/1\n    @DeleteMapping(\"/{id}\")// DELETE /api/users/1\n}" },
  { category: "常用注解", title: "参数绑定注解", description: "请求参数绑定", code: "// 路径参数\n@GetMapping(\"/{id}\")\npublic User get(@PathVariable Long id)\n\n// 查询参数 ?name=xxx\n@GetMapping\npublic List<User> search(@RequestParam String name)\n\n// 请求体\n@PostMapping\npublic User create(@RequestBody @Valid UserDTO dto)\n\n// 请求头\n@GetMapping\npublic void get(@RequestHeader(\"Authorization\") String token)" },
  { category: "常用注解", title: "校验注解", description: "参数校验", code: "public class UserDTO {\n    @NotBlank(message = \"用户名不能为空\")\n    private String username;\n\n    @Email(message = \"邮箱格式不正确\")\n    private String email;\n\n    @Size(min = 6, max = 20, message = \"密码长度6-20位\")\n    private String password;\n\n    @Min(0) @Max(150)\n    private Integer age;\n}" },
  { category: "常用注解", title: "事务注解", description: "声明式事务管理", code: "@Service\npublic class OrderService {\n\n    @Transactional\n    public void createOrder(Order order) {\n        // 事务内操作\n    }\n\n    @Transactional(rollbackFor = Exception.class)\n    public void process() {\n        // 遇到任何异常都回滚\n    }\n\n    @Transactional(readOnly = true)\n    public List<Order> list() {\n        // 只读事务，优化性能\n    }\n}" },

  // 异常处理
  { category: "异常处理", title: "@ExceptionHandler", description: "Controller 内处理特定异常", code: "@RestController\npublic class UserController {\n\n    @ExceptionHandler(ResourceNotFoundException.class)\n    public ResponseEntity<String> handleNotFound(ResourceNotFoundException e) {\n        return ResponseEntity.status(404).body(e.getMessage());\n    }\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {\n        Map<String, String> errors = new HashMap<>();\n        e.getBindingResult().getFieldErrors().forEach(err ->\n            errors.put(err.getField(), err.getDefaultMessage()));\n        return ResponseEntity.badRequest().body(errors);\n    }\n}" },
  { category: "异常处理", title: "@ControllerAdvice", description: "全局异常处理器", code: "@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(Exception.class)\n    public ResponseEntity<ErrorResponse> handleAll(Exception e) {\n        ErrorResponse err = new ErrorResponse(500, e.getMessage());\n        return ResponseEntity.status(500).body(err);\n    }\n\n    @ExceptionHandler(BusinessException.class)\n    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException e) {\n        return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));\n    }\n}" },
  { category: "异常处理", title: "ResponseEntity 错误响应", description: "统一构造错误响应体", code: "public class ErrorResponse {\n    private int code;\n    private String message;\n    private long timestamp;\n}\n\n@ExceptionHandler(Exception.class)\npublic ResponseEntity<ErrorResponse> handle(Exception e) {\n    return ResponseEntity\n        .status(HttpStatus.INTERNAL_SERVER_ERROR)\n        .body(new ErrorResponse(500, e.getMessage(), System.currentTimeMillis()));\n}" },

  // AOP 切面
  { category: "AOP 切面", title: "@Aspect 基础", description: "声明切面类", code: "@Aspect\n@Component\npublic class LoggingAspect {\n\n    @Pointcut(\"execution(* com.example.service.*.*(..))\")\n    public void serviceLayer() { }\n}" },
  { category: "AOP 切面", title: "@Before @After", description: "前置与后置通知", code: "@Aspect\n@Component\npublic class LoggingAspect {\n\n    @Before(\"execution(* com.example.service.*.*(..))\")\n    public void before(JoinPoint jp) {\n        log.info(\"调用: \" + jp.getSignature().getName());\n    }\n\n    @After(\"execution(* com.example.service.*.*(..))\")\n    public void after(JoinPoint jp) {\n        log.info(\"完成: \" + jp.getSignature().getName());\n    }\n}" },
  { category: "AOP 切面", title: "@Around", description: "环绕通知，可控制方法执行", code: "@Around(\"execution(* com.example.service.*.*(..))\")\npublic Object around(ProceedingJoinPoint pjp) throws Throwable {\n    long start = System.currentTimeMillis();\n    try {\n        return pjp.proceed();\n    } finally {\n        log.info(\"耗时: \" + (System.currentTimeMillis() - start) + \"ms\");\n    }\n}" },
  { category: "AOP 切面", title: "@Pointcut 表达式", description: "常用切点表达式", code: "@Pointcut(\"execution(* com.example.service.*.*(..))\")\nprivate void serviceMethods() { }\n\n@Pointcut(\"@annotation(com.example.annotation.Log)\")\nprivate void logAnnotation() { }\n\n@Pointcut(\"within(com.example.controller..*)\")\nprivate void controllerLayer() { }\n\n@Pointcut(\"bean(userService)\")\nprivate void userServiceBean() { }" },

  // 异步与调度
  { category: "异步与调度", title: "@Async 异步方法", description: "方法异步执行", code: "@Service\npublic class UserService {\n\n    @Async\n    public CompletableFuture<User> findUserAsync(Long id) {\n        User user = userRepo.findById(id).orElseThrow();\n        return CompletableFuture.completedFuture(user);\n    }\n}\n\n@SpringBootApplication\n@EnableAsync\npublic class Application { }" },
  { category: "异步与调度", title: "CompletableFuture", description: "异步编排与组合", code: "@Async\npublic CompletableFuture<Result> processAsync() {\n    return CompletableFuture.supplyAsync(() -> doWork())\n        .thenApply(r -> transform(r))\n        .exceptionally(ex -> handleError(ex));\n}" },
  { category: "异步与调度", title: "定时任务 @Scheduled", description: "定时执行任务", code: "@SpringBootApplication\n@EnableScheduling\npublic class Application { }\n\n@Component\npublic class MyTask {\n\n    @Scheduled(fixedRate = 60000)\n    public void task1() { }\n\n    @Scheduled(cron = \"0 0 2 * * ?\")\n    public void task2() { }\n\n    @Scheduled(fixedDelay = 5000, initialDelay = 1000)\n    public void task3() { }\n}" },

  // 测试
  { category: "测试", title: "@SpringBootTest", description: "集成测试加载完整上下文", code: "@SpringBootTest\nclass UserServiceTest {\n\n    @Autowired\n    private UserService userService;\n\n    @Test\n    void testFindUser() {\n        User user = userService.findById(1L);\n        assertNotNull(user);\n    }\n}" },
  { category: "测试", title: "@WebMvcTest", description: "Web 层单元测试", code: "@WebMvcTest(UserController.class)\nclass UserControllerTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @MockBean\n    private UserService userService;\n\n    @Test\n    void testGetUser() throws Exception {\n        when(userService.findById(1L)).thenReturn(new User());\n        mockMvc.perform(get(\"/api/users/1\"))\n            .andExpect(status().isOk());\n    }\n}" },
  { category: "测试", title: "@MockBean", description: "注入 Mock 对象替换 Bean", code: "@SpringBootTest\nclass OrderServiceTest {\n\n    @Autowired\n    private OrderService orderService;\n\n    @MockBean\n    private UserService userService;\n\n    @MockBean\n    private OrderRepository orderRepository;\n\n    @Test\n    void testCreateOrder() {\n        when(userService.getCurrent()).thenReturn(new User());\n        orderService.create(new Order());\n        verify(orderRepository).save(any());\n    }\n}" },
  { category: "测试", title: "MockMvc 请求模拟", description: "模拟 HTTP 请求并断言", code: "mockMvc.perform(\n    post(\"/api/users\")\n        .contentType(MediaType.APPLICATION_JSON)\n        .content(\"{\\\"name\\\":\\\"test\\\"}\")\n)\n.andExpect(status().isCreated())\n.andExpect(jsonPath(\"$.name\").value(\"test\"));" },

  // Actuator
  { category: "Actuator 监控", title: "启用 Actuator", description: "添加健康检查和监控端点", code: "# pom.xml 依赖\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-actuator</artifactId>\n</dependency>\n\n# application.yml\nmanagement:\n  endpoints:\n    web:\n      exposure:\n        include: health,info,metrics\n  endpoint:\n    health:\n      show-details: always" },

  // 文件上传
  { category: "文件上传", title: "文件上传配置", description: "配置文件上传大小限制", code: "spring:\n  servlet:\n    multipart:\n      max-file-size: 10MB\n      max-request-size: 50MB" },
  { category: "文件上传", title: "文件上传接口", description: "编写文件上传 Controller", code: "@PostMapping(\"/upload\")\npublic String upload(@RequestParam(\"file\") MultipartFile file) {\n    String filename = file.getOriginalFilename();\n    String path = \"/uploads/\" + UUID.randomUUID() + \"-\" + filename;\n    file.transferTo(new File(path));\n    return path;\n}" },

  // 其他
  { category: "其他配置", title: "JSON 日期格式", description: "配置 JSON 序列化日期格式", code: "spring:\n  jackson:\n    date-format: yyyy-MM-dd HH:mm:ss\n    time-zone: Asia/Shanghai\n    default-property-inclusion: non_null" },
  { category: "其他配置", title: "国际化", description: "配置多语言消息", code: "spring:\n  messages:\n    basename: i18n/messages\n    encoding: UTF-8" },
  { category: "其他配置", title: "拦截器 HandlerInterceptor", description: "请求前后拦截处理", code: "public class AuthInterceptor implements HandlerInterceptor {\n\n    @Override\n    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {\n        if (req.getHeader(\"Authorization\") == null) {\n            res.setStatus(401);\n            return false;\n        }\n        return true;\n    }\n}\n\n@Configuration\npublic class WebConfig implements WebMvcConfigurer {\n    @Override\n    public void addInterceptors(InterceptorRegistry registry) {\n        registry.addInterceptor(new AuthInterceptor())\n            .addPathPatterns(\"/api/**\")\n            .excludePathPatterns(\"/api/login\");\n    }\n}" },
  { category: "其他配置", title: "@ConfigurationProperties", description: "配置属性绑定到 Bean", code: "@ConfigurationProperties(prefix = \"app\")\n@Component\npublic class AppProperties {\n    private String name;\n    private int maxSize = 100;\n    private List<String> allowedHosts;\n}\n\n# application.yml\napp:\n  name: myapp\n  max-size: 200\n  allowed-hosts: localhost,127.0.0.1" },
  { category: "其他配置", title: "@Value 注入", description: "注入单个配置值", code: "@Component\npublic class MyService {\n    @Value(\"${app.name}\")\n    private String appName;\n\n    @Value(\"${server.port:8080}\")\n    private int port;\n\n    @Value(\"${app.features:true}\")\n    private boolean featureEnabled;\n}" },
  { category: "其他配置", title: "Swagger / OpenAPI", description: "springdoc-openapi 配置", code: "# pom.xml\n<dependency>\n    <groupId>org.springdoc</groupId>\n    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>\n    <version>2.3.0</version>\n</dependency>\n\n# application.yml\nspringdoc:\n  api-docs:\n    path: /v3/api-docs\n  swagger-ui:\n    path: /swagger-ui.html" },
  { category: "其他配置", title: "Maven 常用", description: "spring-boot-maven-plugin 与 profiles", code: "<build>\n  <plugins>\n    <plugin>\n      <groupId>org.springframework.boot</groupId>\n      <artifactId>spring-boot-maven-plugin</artifactId>\n    </plugin>\n  </plugins>\n</build>\n\n# 打包: mvn clean package\n# 指定 profile: mvn spring-boot:run -Dspring-boot.run.profiles=dev\n# 跳过测试: mvn package -DskipTests" },
  { category: "其他配置", title: "WebSocket 配置", description: "SockJS + STOMP 消息订阅", code: "@Configuration\n@EnableWebSocketMessageBroker\npublic class WebSocketConfig implements WebSocketMessageBrokerConfigurer {\n\n    @Override\n    public void configureMessageBroker(MessageBrokerRegistry config) {\n        config.enableSimpleBroker(\"/topic\");\n        config.setApplicationDestinationPrefixes(\"/app\");\n    }\n\n    @Override\n    public void registerStompEndpoints(StompEndpointRegistry registry) {\n        registry.addEndpoint(\"/ws\").withSockJS();\n    }\n}" },
  { category: "其他配置", title: "RabbitMQ 配置", description: "消息队列基本配置", code: "spring:\n  rabbitmq:\n    host: localhost\n    port: 5672\n    username: guest\n    password: guest\n    listener:\n      simple:\n        acknowledge-mode: auto\n        prefetch: 1\n\n@RabbitListener(queues = \"my.queue\")\npublic void handle(Message msg) { }" },
  { category: "其他配置", title: "Kafka 配置", description: "Kafka 生产者与消费者", code: "spring:\n  kafka:\n    bootstrap-servers: localhost:9092\n    consumer:\n      group-id: my-group\n      auto-offset-reset: earliest\n    producer:\n      key-serializer: org.apache.kafka.common.serialization.StringSerializer\n      value-serializer: org.apache.kafka.common.serialization.StringSerializer\n\n@KafkaListener(topics = \"my-topic\")\npublic void listen(String message) { }" },
];

export default function SpringBootRefPage() {
  return (
    <ToolPageWrapper>
      <CheatSheet
        title="Spring Boot 配置参考"
        subtitle="Spring Boot 常用配置、注解、代码片段速查，支持搜索和一键复制"
        items={items}
        categories={categories}
      />
    </ToolPageWrapper>
  );
}
