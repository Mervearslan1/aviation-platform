# Java Backend Coding & Architecture Guidelines

You are working on a **single Spring Boot application** implemented as a **Feature-Based Modular Monolith**.

You MUST understand and follow this architecture before writing or modifying any Java code.

Do not redesign the architecture.

Do not convert the project into microservices.

Do not create separate Spring Boot applications for individual features.

The goal is to keep the backend modular, maintainable and organized while keeping the entire backend inside ONE Spring Boot application.

---

# 1. Core Architecture

The backend follows this structure:

```text
React Frontend
       │
       │ HTTP / REST
       ▼
Spring Boot Monolith
       │
       ├── auth
       ├── user
       ├── course
       ├── lesson
       └── progress
       │
       ▼
PostgreSQL
```

The backend is ONE application.

For example:

```text
AviationLearningApplication
```

starts the entire backend.

The following are features/modules inside the application:

```text
auth
user
course
lesson
progress
```

They are NOT microservices.

---

# 2. Package-by-Feature Rule

The most important architectural rule is:

**Organize code by business feature, not by technical layer.**

Do NOT create:

```text
controller/
service/
repository/
entity/
dto/
```

at the root of the application.

Instead use:

```text
user/
course/
lesson/
progress/
auth/
```

Each feature owns its own technical layers.

Example:

```text
user/
├── controller/
├── dto/
├── entity/
├── repository/
└── service/
```

This means that all code related to users stays inside the `user` package.

---

# 3. Feature Structure

Every major business feature should follow this pattern:

```text
feature/
├── controller/
├── dto/
├── entity/
├── repository/
└── service/
    ├── FeatureService.java
    └── FeatureServiceImpl.java
```

Example:

```text
course/
├── controller/
│   └── CourseController.java
│
├── dto/
│   ├── CourseRequest.java
│   └── CourseResponse.java
│
├── entity/
│   └── Course.java
│
├── repository/
│   └── CourseRepository.java
│
└── service/
    ├── CourseService.java
    └── CourseServiceImpl.java
```

---

# 4. Controller Responsibility

Controllers are responsible for HTTP communication.

A controller should:

1. Receive the HTTP request.
2. Validate request input when appropriate.
3. Call the service.
4. Return the response.

Controllers MUST NOT contain business logic.

Bad:

```java
@PostMapping
public CourseResponse createCourse(
        @RequestBody CourseRequest request) {

    if (request.getTitle() == null) {
        throw new RuntimeException("Title required");
    }

    Course course = new Course();
    course.setTitle(request.getTitle());

    courseRepository.save(course);

    return ...
}
```

This puts business and persistence logic inside the controller.

Instead:

```java
@PostMapping
public CourseResponse createCourse(
        @RequestBody CourseRequest request) {

    return courseService.createCourse(request);
}
```

The controller should be thin.

---

# 5. Service Interface

Each business feature should expose its operations through a service interface.

Example:

```java
public interface CourseService {

    CourseResponse getCourse(Long id);

    List<CourseResponse> getCourses();

    CourseResponse createCourse(CourseRequest request);

    CourseResponse updateCourse(
            Long id,
            CourseRequest request);

    void deleteCourse(Long id);
}
```

The interface defines WHAT the feature can do.

It should not contain implementation details.

---

# 6. Service Implementation

The implementation contains the actual business logic.

Example:

```java
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public CourseResponse getCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found: " + id));

        return CourseResponse.from(course);
    }
}
```

The service implementation is responsible for:

- Business rules
- Validation of business conditions
- Coordinating repositories
- Coordinating other feature services when necessary
- Mapping entities to DTOs
- Transaction boundaries

---

# 7. Service Interface vs Implementation

Always keep the interface and implementation separate.

Use:

```text
service/
├── UserService.java
└── UserServiceImpl.java
```

Do NOT put all service logic directly into:

```text
UserService.java
```

unless there is a specific architectural reason.

The normal pattern is:

```text
Controller
    ↓
UserService
    ↓
UserServiceImpl
    ↓
UserRepository
```

The controller depends on the interface:

```java
private final UserService userService;
```

It should not depend directly on:

```java
UserServiceImpl
```

---

# 8. Repository Responsibility

Repositories are responsible for database access.

Use Spring Data JPA.

Example:

```java
@Repository
public interface CourseRepository
        extends JpaRepository<Course, Long> {

    List<Course> findByPublishedTrue();
}
```

Repositories should NOT contain business logic.

Do not put things such as:

```java
if (...)
```

or complex business decisions into repositories.

The repository answers database-related questions.

The service decides what those results mean.

---

# 9. Entity Responsibility

Entities represent the persistence model.

Example:

```java
@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private boolean published;
}
```

Entities should primarily represent:

- Database fields
- Relationships
- Persistence configuration

Avoid putting HTTP/API concerns into entities.

For example, do NOT put:

```java
@PostMapping
```

inside an entity.

---

# 10. DTO Responsibility

Do not expose JPA entities directly from REST controllers.

Use DTOs.

Example:

```text
course/dto/
├── CourseRequest.java
└── CourseResponse.java
```

Request DTO:

```java
public record CourseRequest(
        String title,
        String description
) {
}
```

Response DTO:

```java
public record CourseResponse(
        Long id,
        String title,
        String description,
        boolean published
) {

    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.isPublished()
        );
    }
}
```

The API should expose DTOs, not database entities.

---

# 11. Typical Request Flow

Understand the complete request flow before implementing an endpoint.

For example:

```text
React
  │
  │ POST /api/courses
  ▼
CourseController
  │
  ▼
CourseService
  │
  ▼
CourseServiceImpl
  │
  ▼
CourseRepository
  │
  ▼
PostgreSQL
```

The response flows back:

```text
PostgreSQL
    ↓
CourseRepository
    ↓
CourseServiceImpl
    ↓
CourseResponse
    ↓
CourseController
    ↓
React
```

Each layer has a specific responsibility.

---

# 12. Example Complete Feature

A complete Course feature should look approximately like this:

```text
course/
├── controller/
│   └── CourseController.java
│
├── dto/
│   ├── CourseRequest.java
│   └── CourseResponse.java
│
├── entity/
│   └── Course.java
│
├── repository/
│   └── CourseRepository.java
│
└── service/
    ├── CourseService.java
    └── CourseServiceImpl.java
```

Controller:

```java
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/{id}")
    public CourseResponse getCourse(
            @PathVariable Long id) {

        return courseService.getCourse(id);
    }

    @PostMapping
    public CourseResponse createCourse(
            @Valid @RequestBody CourseRequest request) {

        return courseService.createCourse(request);
    }
}
```

Service:

```java
public interface CourseService {

    CourseResponse getCourse(Long id);

    CourseResponse createCourse(CourseRequest request);
}
```

Implementation:

```java
@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found: " + id));

        return CourseResponse.from(course);
    }

    @Override
    public CourseResponse createCourse(
            CourseRequest request) {

        Course course = new Course();

        course.setTitle(request.title());
        course.setDescription(request.description());

        Course savedCourse =
                courseRepository.save(course);

        return CourseResponse.from(savedCourse);
    }
}
```

Repository:

```java
@Repository
public interface CourseRepository
        extends JpaRepository<Course, Long> {
}
```

This is the expected coding style.

---

# 13. Business Logic Must Stay in Services

When implementing a feature, ask:

"Is this an HTTP concern?"

If yes:

```text
Controller
```

"Is this a business rule?"

If yes:

```text
ServiceImpl
```

"Is this a database operation?"

If yes:

```text
Repository
```

"Is this API input/output data?"

If yes:

```text
DTO
```

"Is this database state?"

If yes:

```text
Entity
```

This separation must be maintained.

---

# 14. Cross-Feature Communication

Features may need information from other features.

For example:

A course may belong to a user.

Do NOT make:

```text
CourseServiceImpl
        ↓
UserRepository
```

if the User feature owns `UserRepository`.

Prefer:

```text
CourseServiceImpl
        ↓
UserService
        ↓
UserRepository
```

This keeps feature boundaries clear.

Example:

```java
private final UserService userService;
```

The Course feature communicates with the public contract of the User feature.

It should not bypass the User feature and directly access its repository.

---

# 15. Common Code

Only truly shared functionality should be placed in:

```text
common/
```

For example:

```text
common/
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
│
├── response/
│   └── ApiResponse.java
│
├── constant/
└── util/
```

Do not use `common/` as a dumping ground.

Do not put:

```text
UserService
CourseService
UserRepository
CourseRepository
```

inside `common/`.

---

# 16. Exception Handling

Use a global exception handler.

Example:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(
            ResourceNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(
                        exception.getMessage()));
    }
}
```

Feature-specific exceptions should remain inside their feature when they are truly feature-specific.

Application-wide exceptions can be placed in:

```text
common/exception/
```

---

# 17. Transactions

Transaction boundaries should normally be placed at the service implementation layer.

Example:

```java
@Service
@Transactional
public class CourseServiceImpl
        implements CourseService {
}
```

Read-only operations may use:

```java
@Transactional(readOnly = true)
```

Do not normally put business transactions in controllers.

---

# 18. Validation

Use Jakarta Bean Validation for request validation.

Example:

```java
public record CourseRequest(

        @NotBlank
        String title,

        @Size(max = 1000)
        String description

) {
}
```

Controller:

```java
public CourseResponse createCourse(
        @Valid @RequestBody CourseRequest request) {
```

Validation annotations belong to DTOs when the validation concerns API input.

Business validation belongs in the service implementation.

---

# 19. Naming Convention

Use clear Java naming.

Classes:

```text
UserController
UserService
UserServiceImpl
UserRepository
User
UserResponse
UpdateUserRequest
```

Do not use unclear names such as:

```text
UserManager2
UserHelper
UserProcessor
UserHandlerService
```

unless there is a real architectural reason.

---

# 20. Do Not Create Unnecessary Abstractions

Do not create interfaces and classes simply because they can exist.

Create abstractions when they provide a meaningful architectural boundary.

The required service pattern is:

```text
Service interface
Service implementation
```

but do not create five additional layers such as:

```text
Manager
Facade
Handler
Processor
Adapter
```

unless the feature actually requires them.

Keep the implementation understandable.

---

# 21. Do Not Overengineer

The application is a normal web application.

Do not introduce distributed-system architecture without an explicit requirement.

Do NOT add:

```text
Kafka
RabbitMQ
Eureka
Spring Cloud
API Gateway
gRPC
Service Discovery
Distributed Transactions
Separate databases
Separate deployments
```

simply because the application has multiple features.

The application should remain a modular monolith.

---

# 22. Adding a New Feature

When a new feature is requested, follow this process.

For example, if a "Quiz" feature is required:

First create:

```text
quiz/
```

Then organize it as:

```text
quiz/
├── controller/
├── dto/
├── entity/
├── repository/
└── service/
    ├── QuizService.java
    └── QuizServiceImpl.java
```

Do NOT add:

```text
QuizController
```

to a global controller package.

Do NOT add:

```text
QuizService
```

to a global service package.

The Quiz feature owns its implementation.

---

# 23. Before Writing Code

Before implementing a feature, determine:

1. What business feature does this belong to?
2. Which package owns this functionality?
3. What HTTP endpoints are required?
4. What DTOs are required?
5. What entities are required?
6. What database operations are required?
7. What business rules belong in the service?
8. Does this feature need to communicate with another feature?
9. Can the communication happen through the other feature's service interface?
10. Is any new shared code genuinely common?

Only after answering these questions should code be generated.

---

# 24. Existing Code Must Be Respected

When modifying existing code:

DO NOT rewrite unrelated parts of the application.

DO NOT introduce a different architecture.

DO NOT move existing classes between packages unless there is a clear architectural reason.

DO NOT create duplicate implementations.

First inspect the existing package structure and understand the current feature boundaries.

Then make the smallest clean change required.

---

# 25. Architecture Decision Summary

The project uses:

```text
Feature-Based Modular Monolith
```

with:

```text
Spring Boot
Spring Data JPA
PostgreSQL
REST API
```

The structure is:

```text
Feature
    │
    ├── Controller
    ├── DTO
    ├── Entity
    ├── Repository
    └── Service
          ├── Interface
          └── Implementation
```

The request flow is:

```text
React
  ↓
Controller
  ↓
Service Interface
  ↓
Service Implementation
  ↓
Repository
  ↓
PostgreSQL
```

The most important rules are:

**ONE Spring Boot application.**

**ONE backend deployment.**

**Package by feature.**

**Each feature owns its controller, DTO, entity, repository and service.**

**Service interface and ServiceImpl are separate.**

**Controllers stay thin.**

**Business logic belongs in ServiceImpl.**

**Database access belongs in Repository.**

**API contracts use DTOs.**

**Entities are not exposed directly through REST.**

**Features communicate through their public service contracts.**

**Do not create microservices unless explicitly requested.**

**Do not introduce unnecessary architecture or abstractions.**

Before generating code, understand and follow these rules.