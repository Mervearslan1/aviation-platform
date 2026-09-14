# Aviation Learning Platform (ALP)
## Backend Technical & Implementation Specification

**Project Phase:** Phase 1  
**Backend:** Java + Spring Boot  
**Database:** PostgreSQL  
**API:** REST  
**Authentication:** JWT  
**ORM:** Spring Data JPA / Hibernate  
**Database Migration:** Flyway  
**API Documentation:** OpenAPI / Swagger  
**Build Tool:** Maven veya Gradle  
**Java Version:** Java 21+  

---

# 1. Dokümanın Amacı

Bu doküman Aviation Learning Platform backend uygulamasının nasıl davranacağını tanımlar.

Bu doküman yalnızca teknoloji seçimini açıklamaz.

Aşağıdaki konular backend implementation açısından açıkça tanımlanmalıdır:

- Entity'ler
- Entity ilişkileri
- Database constraints
- REST endpointleri
- Request DTO'ları
- Response DTO'ları
- Validation
- Authentication
- Authorization
- Role sistemi
- Business rules
- State transitions
- Progress sistemi
- Article workflow
- Learning workflow
- Quiz sistemi
- Simulation sistemi
- Error handling
- Audit logging
- Pagination
- Filtering
- Sorting
- Transaction boundaries

Geliştirici bu dokümandaki kuralları temel alarak implementation yapmalıdır.

Belirtilmeyen konularda güvenli ve standart Spring Boot yaklaşımı tercih edilmelidir.

---

# 2. Backend'in Sorumlulukları

Backend aşağıdaki sorumluluklara sahiptir:

1. Kullanıcı authentication işlemleri.
2. Kullanıcı ve rol yönetimi.
3. Article yönetimi.
4. Article workflow yönetimi.
5. Category ve Tag yönetimi.
6. Learning Path yönetimi.
7. Course yönetimi.
8. Module yönetimi.
9. Lesson yönetimi.
10. Activity yönetimi.
11. Quiz yönetimi.
12. User progress yönetimi.
13. Simulation task yönetimi.
14. Achievement yönetimi.
15. Notification yönetimi.
16. Comment yönetimi.
17. Favorite yönetimi.
18. Audit logging.
19. API authorization.
20. Database persistence.

Frontend hiçbir business rule'u tek başına belirlememelidir.

Backend source of truth olmalıdır.

---

# 3. Backend Architecture

Önerilen architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Cross-cutting concerns:

```text
Security
Exception Handling
Validation
Logging
Audit
Configuration
```

Önerilen package yapısı:

```text
com.alp

├── auth
│   ├── controller
│   ├── service
│   ├── dto
│   ├── security
│   └── mapper
│
├── user
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
├── article
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── mapper
│
├── learning
│   ├── learningpath
│   ├── course
│   ├── module
│   ├── lesson
│   └── activity
│
├── quiz
│
├── progress
│
├── simulation
│
├── achievement
│
├── notification
│
├── comment
│
├── favorite
│
├── audit
│
└── common
    ├── exception
    ├── response
    ├── validation
    ├── pagination
    └── config
```

Business logic controller içerisinde tutulmamalıdır.

---

# 4. API Base Path

Tüm API endpointleri:

```text
/api/v1
```

ile başlamalıdır.

Örnek:

```text
/api/v1/auth/login
/api/v1/articles
/api/v1/courses
/api/v1/progress
```

Version değişiklikleri backward compatibility gerektirdiğinde yeni API version oluşturulmalıdır.

---

# 5. Authentication

JWT tabanlı authentication kullanılmalıdır.

Authentication akışı:

```text
Client
   ↓
POST /auth/login
   ↓
Backend
   ↓
Credentials validation
   ↓
JWT oluştur
   ↓
Access Token + Refresh Token
   ↓
Client
```

Protected endpointlerde:

```http
Authorization: Bearer <access-token>
```

kullanılmalıdır.

---

# 6. Password Security

Password hiçbir zaman plaintext olarak database'e yazılmamalıdır.

Önerilen:

```text
BCrypt
```

veya Spring Security tarafından desteklenen güvenli password encoder.

Password response DTO içerisinde kesinlikle dönmemelidir.

---

# 7. JWT

Access token:

- kısa ömürlü olmalıdır.
- kullanıcı ID içermelidir.
- role/authority bilgisi içermelidir.

Refresh token:

- access token yenilemek için kullanılmalıdır.
- revoke edilebilir olmalıdır.
- database'de hashlenmiş şekilde tutulması tercih edilmelidir.

JWT içerisinde gereksiz kullanıcı bilgileri tutulmamalıdır.

---

# 8. Roles

Faz 1 roller:

```text
USER
AUTHOR
EDITOR
ADMIN
```

Role hierarchy otomatik varsayılmamalıdır.

Örneğin:

```text
AUTHOR != EDITOR
EDITOR != ADMIN
```

Bir kullanıcı birden fazla role sahip olabilecek şekilde tasarlanabilir.

---

# 9. Authorization

Authorization iki seviyede yapılmalıdır.

## Endpoint Authorization

Örneğin:

```text
POST /articles
AUTHOR
EDITOR
ADMIN
```

## Resource Authorization

Örneğin AUTHOR yalnızca kendi draft article'ını düzenleyebilir.

Backend şu kontrolü yapmalıdır:

```text
currentUser.id == article.authorId
```

Sadece frontend'de buton gizlemek authorization değildir.

---

# 10. User Entity

Temel alanlar:

```text
id
username
email
passwordHash
displayName
biography
profileImageUrl
status
createdAt
updatedAt
lastLoginAt
```

Status:

```text
ACTIVE
INACTIVE
SUSPENDED
```

---

# 11. User Constraints

```text
username UNIQUE
email UNIQUE
username NOT NULL
email NOT NULL
password_hash NOT NULL
```

Email karşılaştırmaları case-insensitive yapılmalıdır.

Örneğin:

```text
Merve@example.com
merve@example.com
```

aynı kullanıcı olarak değerlendirilmelidir.

---

# 12. User Registration

Endpoint:

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "Password123!",
  "displayName": "User"
}
```

Kurallar:

- username zorunlu.
- email zorunlu.
- password zorunlu.
- email unique.
- username unique.
- password policy uygulanmalı.
- kullanıcı default olarak USER rolü ile oluşturulmalı.
- status ACTIVE olmalıdır.

---

# 13. Login

Endpoint:

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Başarılı response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

Başarısız login:

```text
HTTP 401
```

Dönen hata kullanıcıya:

```text
Invalid credentials
```

şeklinde olmalıdır.

Email mevcut mu değil mi bilgisi login endpointinden sızdırılmamalıdır.

---

# 14. Article Domain

Article sistemin CMS/blog bölümüdür.

Entity:

```text
Article
```

Alanlar:

```text
id
authorId
categoryId
title
slug
summary
content
coverImageUrl
status
createdAt
updatedAt
publishedAt
```

---

# 15. Article Status

```text
DRAFT
SUBMITTED
IN_REVIEW
REVISION_REQUIRED
APPROVED
PUBLISHED
REJECTED
ARCHIVED
```

---

# 16. Article State Machine

Geçerli transitionlar:

```text
DRAFT
 ↓
SUBMITTED

SUBMITTED
 ↓
IN_REVIEW

IN_REVIEW
 ↓
REVISION_REQUIRED
 ↓
AUTHOR

IN_REVIEW
 ↓
APPROVED

APPROVED
 ↓
PUBLISHED

PUBLISHED
 ↓
ARCHIVED
```

Invalid transition backend tarafından reddedilmelidir.

Örneğin:

```text
PUBLISHED → DRAFT
```

doğrudan yapılamaz.

---

# 17. Article Creation

AUTHOR:

```http
POST /api/v1/articles
```

çağırabilir.

Article başlangıçta:

```text
DRAFT
```

olmalıdır.

Author ID authentication context'ten alınmalıdır.

Frontend'in gönderdiği:

```json
{
  "authorId": 123
}
```

gibi bir alan backend tarafından dikkate alınmamalıdır.

---

# 18. Article Ownership

AUTHOR yalnızca kendi article'larını:

- update
- submit
- edit

edebilir.

EDITOR ve ADMIN gerekli yetkiye sahiptir.

USER article oluşturamaz.

---

# 19. Article Submission

Endpoint:

```http
POST /api/v1/articles/{id}/submit
```

Koşullar:

- current user article sahibi olmalı.
- status DRAFT veya REVISION_REQUIRED olmalı.
- title dolu olmalı.
- content dolu olmalı.

Başarılı durumda:

```text
DRAFT → SUBMITTED
```

---

# 20. Article Review

EDITOR:

```http
POST /api/v1/articles/{id}/review
```

ile review başlatabilir.

Status:

```text
SUBMITTED → IN_REVIEW
```

---

# 21. Revision Request

Endpoint:

```http
POST /api/v1/articles/{id}/request-revision
```

Request:

```json
{
  "comment": "METAR örneğinin kaynağı eklenmelidir."
}
```

Comment zorunludur.

Transition:

```text
IN_REVIEW → REVISION_REQUIRED
```

Revision history database'de tutulmalıdır.

---

# 22. Article Approval

EDITOR:

```http
POST /api/v1/articles/{id}/approve
```

çağırabilir.

Transition:

```text
IN_REVIEW → APPROVED
```

---

# 23. Article Publishing

EDITOR veya ADMIN:

```http
POST /api/v1/articles/{id}/publish
```

çağırabilir.

Transition:

```text
APPROVED → PUBLISHED
```

`publishedAt` otomatik olarak backend tarafından set edilmelidir.

---

# 24. Article Revision

Published article doğrudan overwrite edilmemelidir.

Article versioning kullanılmalıdır.

Entity:

```text
ArticleVersion
```

Alanlar:

```text
id
articleId
versionNumber
title
summary
content
createdBy
createdAt
```

---

# 25. Categories

Category:

```text
id
name
slug
description
status
createdAt
updatedAt
```

Category name unique olmalıdır.

Slug unique olmalıdır.

---

# 26. Tags

Tag:

```text
id
name
slug
```

Article ve Tag arasında:

```text
Many-to-Many
```

ilişki kurulabilir.

Join table:

```text
article_tags
```

---

# 27. Learning Path

Learning Path kullanıcının ana öğrenme rotasıdır.

Entity:

```text
LearningPath
```

Alanlar:

```text
id
title
slug
description
difficulty
status
createdAt
updatedAt
```

Difficulty:

```text
BEGINNER
INTERMEDIATE
ADVANCED
```

Status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

---

# 28. Course

Bir Learning Path birden fazla Course içerebilir.

```text
LearningPath
    1
    |
    N
 Course
```

Course:

```text
id
learningPathId
title
slug
description
difficulty
orderIndex
status
createdAt
updatedAt
```

---

# 29. Module

Course:

```text
Course
  |
  N
Module
```

Module:

```text
id
courseId
title
description
orderIndex
status
```

---

# 30. Lesson

Module:

```text
Module
  |
  N
Lesson
```

Lesson:

```text
id
moduleId
title
slug
description
content
orderIndex
isRequired
status
```

---

# 31. Activity

Lesson bir veya daha fazla Activity içerebilir.

```text
Lesson
  |
  N
Activity
```

Activity:

```text
id
lessonId
type
title
content
orderIndex
isRequired
passingScore
configuration
```

---

# 32. Activity Types

Faz 1:

```text
TEXT
MULTIPLE_CHOICE
TRUE_FALSE
PRACTICAL_TASK
```

Gelecek:

```text
IMAGE
VIDEO
MATCHING
ORDERING
SCENARIO
SIMULATION
REFLECTION
```

Backend extensible tasarlanmalıdır.

---

# 33. Activity Configuration

Activity tipine göre configuration JSONB kullanılabilir.

Örneğin MULTIPLE_CHOICE:

```json
{
  "question": "Rudder hangi hareketi kontrol eder?",
  "options": [
    "Pitch",
    "Roll",
    "Yaw",
    "Throttle"
  ],
  "correctOption": "Yaw"
}
```

Ancak kritik business data yalnızca JSON içerisinde tutulmamalıdır.

Quiz sistemi büyütülecekse ayrı relational entity'ler kullanılmalıdır.

---

# 34. Lesson Completion

Lesson completion için gerekli Activity'ler tamamlanmalıdır.

Örneğin:

```text
Activity 1 ✓
Activity 2 ✓
Activity 3 ✓
Quiz 8/10 ✓
```

sonrasında:

```text
Lesson = COMPLETED
```

olabilir.

---

# 35. Progress Domain

Progress sistemin temel özelliklerinden biridir.

Progress kullanıcıya:

```text
Nereden başladım?
Neredeyim?
Ne kadar ilerledim?
Sırada ne var?
```

sorularının cevabını vermelidir.

---

# 36. Progress Status

```text
LOCKED
NOT_STARTED
IN_PROGRESS
COMPLETED
FAILED
```

---

# 37. User Activity Progress

Entity:

```text
UserActivityProgress
```

Alanlar:

```text
id
userId
activityId
status
attemptCount
score
startedAt
completedAt
updatedAt
```

Unique constraint:

```text
(userId, activityId)
```

---

# 38. User Lesson Progress

Entity:

```text
UserLessonProgress
```

Alanlar:

```text
id
userId
lessonId
status
progressPercentage
startedAt
completedAt
updatedAt
```

Unique:

```text
(userId, lessonId)
```

---

# 39. User Course Progress

Entity:

```text
UserCourseProgress
```

Alanlar:

```text
id
userId
courseId
progressPercentage
status
startedAt
completedAt
updatedAt
```

Unique:

```text
(userId, courseId)
```

---

# 40. Progress Calculation

Progress frontend tarafından hesaplanmamalıdır.

Backend hesaplamalıdır.

Örnek:

```text
5 total lesson
4 completed
```

Progress:

```text
80%
```

hesaplanmalıdır.

Formula:

```text
completedRequiredLessons / totalRequiredLessons * 100
```

---

# 41. Unlock Rules

Bir Lesson'ın açılması için dependency kontrol edilmelidir.

Örnek:

```text
Lesson A
   ↓
Lesson B
```

A tamamlanmadan B:

```text
LOCKED
```

olmalıdır.

Dependency sistemi Lesson seviyesinde tanımlanabilir.

---

# 42. Lesson Dependency

Önerilen entity:

```text
LessonDependency
```

Alanlar:

```text
id
lessonId
requiredLessonId
```

Bir lesson birden fazla prerequisite'e sahip olabilir.

Örnek:

```text
VFR Basics
requires:
- Aerodynamics Basics
- Aircraft Controls
```

---

# 43. Quiz Domain

Quiz:

```text
Quiz
QuizQuestion
QuizOption
QuizAttempt
```

şeklinde modellenmelidir.

---

# 44. Quiz

```text
id
activityId
title
description
passingScore
maxAttempts
createdAt
updatedAt
```

---

# 45. Quiz Question

```text
id
quizId
questionText
questionType
orderIndex
points
```

Question type:

```text
MULTIPLE_CHOICE
TRUE_FALSE
```

---

# 46. Quiz Option

```text
id
questionId
optionText
isCorrect
orderIndex
```

`isCorrect` yalnızca backend tarafından değerlendirme sırasında kullanılmalıdır.

Frontend'e quiz başlamadan doğru cevap gönderilmemelidir.

---

# 47. Quiz Attempt

```text
id
quizId
userId
score
status
startedAt
completedAt
```

Status:

```text
IN_PROGRESS
PASSED
FAILED
```

---

# 48. Quiz Security

Quiz endpointi:

```text
GET /quiz/{id}
```

ile dönerken doğru cevap bilgisi frontend'e gönderilmemelidir.

Evaluation backend tarafında yapılmalıdır.

---

# 49. Quiz Submission

Endpoint:

```http
POST /api/v1/quizzes/{id}/attempts
```

Request:

```json
{
  "answers": [
    {
      "questionId": 1,
      "optionId": 4
    },
    {
      "questionId": 2,
      "optionId": 8
    }
  ]
}
```

Backend:

1. Attempt oluşturur.
2. Soruları doğrular.
3. Cevapları değerlendirir.
4. Score hesaplar.
5. Passing score ile karşılaştırır.
6. Attempt'i tamamlar.
7. Progress'i günceller.

---

# 50. Simulation Domain

Simulation sistemi ilk aşamada gerçek simülatör API entegrasyonu gerektirmez.

Backend simulation task tanımlayacaktır.

Entity:

```text
SimulationTask
```

Alanlar:

```text
id
title
description
platform
aircraft
departureAirport
arrivalAirport
difficulty
instructions
requirements
status
createdAt
updatedAt
```

---

# 51. Simulation Platform

Örnek:

```text
MSFS
IVAO
OTHER
```

Platform enum ileride genişletilebilir.

---

# 52. Simulation Attempt

```text
id
userId
simulationTaskId
status
notes
score
startedAt
completedAt
```

Status:

```text
STARTED
SUBMITTED
COMPLETED
REJECTED
```

---

# 53. Simulation Completion

İlk fazda kullanıcı:

```text
Görevi Başlat
```

der.

Daha sonra simülasyonu dış ortamda gerçekleştirir.

Sonrasında:

```text
Görevi Tamamladım
```

işlemini yapar.

Backend attempt oluşturur veya mevcut attempt'i tamamlar.

İlk fazda gerçek uçuş doğrulaması yapılmayacaktır.

---

# 54. Comment Domain

Comment:

```text
id
userId
articleId
content
status
createdAt
updatedAt
```

Status:

```text
VISIBLE
HIDDEN
DELETED
```

USER kendi comment'ini silebilir.

EDITOR ve ADMIN moderation yapabilir.

---

# 55. Favorite Domain

Favorite:

```text
id
userId
contentType
contentId
createdAt
```

Content type:

```text
ARTICLE
COURSE
LESSON
```

Unique:

```text
(userId, contentType, contentId)
```

---

# 56. Notification

Notification:

```text
id
userId
type
title
message
isRead
createdAt
```

Notification types:

```text
ARTICLE_REVISION_REQUESTED
ARTICLE_APPROVED
ARTICLE_REJECTED
ARTICLE_PUBLISHED
ACHIEVEMENT_UNLOCKED
SYSTEM
```

---

# 57. Achievement

Achievement:

```text
id
code
name
description
icon
conditionType
createdAt
```

Örnek:

```text
FIRST_LESSON
FIRST_QUIZ
FIRST_SIMULATION
FIRST_VFR
```

---

# 58. User Achievement

```text
id
userId
achievementId
earnedAt
```

Unique:

```text
(userId, achievementId)
```

---

# 59. Audit Log

Audit log kritik işlemleri kaydetmelidir.

Entity:

```text
AuditLog
```

Alanlar:

```text
id
userId
action
entityType
entityId
metadata
createdAt
ipAddress
```

Örnek:

```text
ARTICLE_PUBLISHED
ARTICLE_REVISION_REQUESTED
USER_ROLE_CHANGED
USER_DISABLED
COURSE_PUBLISHED
```

---

# 60. API Pagination

Liste endpointleri pagination desteklemelidir.

Örnek:

```http
GET /api/v1/articles?page=0&size=20
```

Response:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

Default:

```text
page = 0
size = 20
```

Maximum:

```text
size = 100
```

---

# 61. Sorting

Örnek:

```http
GET /api/v1/articles?sort=createdAt,desc
```

Desteklenen sorting alanları whitelist üzerinden kontrol edilmelidir.

Client'ın arbitrary SQL field göndermesine izin verilmemelidir.

---

# 62. Filtering

Article:

```http
GET /api/v1/articles?category=pilotaj&status=PUBLISHED
```

Course:

```http
GET /api/v1/courses?difficulty=BEGINNER
```

Progress:

```http
GET /api/v1/progress?status=IN_PROGRESS
```

---

# 63. API Response Standardı

Başarılı response'lar mümkün olduğunca tutarlı olmalıdır.

Tek resource:

```json
{
  "data": {}
}
```

Liste:

```json
{
  "data": [],
  "pagination": {}
}
```

veya API standardı olarak doğrudan resource döndürülüyorsa tüm endpointlerde aynı yaklaşım korunmalıdır.

---

# 64. Error Response

Standart:

```json
{
  "timestamp": "2026-09-14T12:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ],
  "path": "/api/v1/articles"
}
```

---

# 65. Error Codes

Örnek:

```text
VALIDATION_ERROR
INVALID_CREDENTIALS
ACCESS_DENIED
RESOURCE_NOT_FOUND
RESOURCE_ALREADY_EXISTS
INVALID_STATE_TRANSITION
RESOURCE_LOCKED
ARTICLE_NOT_OWNED
QUIZ_ATTEMPT_LIMIT
LESSON_NOT_COMPLETED
INVALID_TOKEN
TOKEN_EXPIRED
```

---

# 66. HTTP Status Codes

```text
200 OK
201 CREATED
204 NO_CONTENT
400 BAD_REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT_FOUND
409 CONFLICT
422 UNPROCESSABLE_ENTITY
500 INTERNAL_SERVER_ERROR
```

---

# 67. Global Exception Handling

Spring:

```text
@RestControllerAdvice
```

kullanılmalıdır.

Exception türleri merkezi olarak yönetilmelidir.

Controller'larda tekrarlanan try/catch blokları kullanılmamalıdır.

---

# 68. Validation

Jakarta Bean Validation kullanılmalıdır.

Örneğin:

```text
@NotBlank
@Email
@Size
@NotNull
@Min
@Max
```

Frontend validation yeterli kabul edilmemelidir.

---

# 69. Transaction Management

Birden fazla database işlemi tek business operation'ın parçasıysa transaction kullanılmalıdır.

Örneğin quiz submission:

```text
create attempt
+
evaluate answers
+
save score
+
update progress
+
unlock next lesson
+
create achievement
```

tek transaction içerisinde yönetilebilir.

Transaction başarısız olursa ilgili işlemler rollback edilmelidir.

---

# 70. Concurrency

Progress ve quiz submission gibi işlemlerde duplicate request problemi düşünülmelidir.

Örneğin kullanıcı aynı "Complete Lesson" requestini iki kez gönderirse:

```text
duplicate progress
```

oluşmamalıdır.

Database unique constraint ve uygun service logic kullanılmalıdır.

---

# 71. Soft Delete

Kullanıcı ve kritik içeriklerde doğrudan hard delete tercih edilmemelidir.

Örneğin User:

```text
status = INACTIVE
```

şeklinde pasifleştirilebilir.

Article:

```text
ARCHIVED
```

olabilir.

Audit gerektiren veriler fiziksel olarak silinmemelidir.

---

# 72. Database Relations

Temel ilişkiler:

```text
User
 ├── Articles
 ├── Comments
 ├── Progress
 ├── SimulationAttempts
 ├── Achievements
 └── Notifications

LearningPath
 └── Courses
      └── Modules
           └── Lessons
                └── Activities

Article
 ├── Category
 ├── Tags
 ├── Versions
 └── Comments
```

---

# 73. Database Indexing

Index oluşturulması gereken alanlar örnek olarak:

```text
users.email
users.username

articles.slug
articles.status
articles.category_id
articles.author_id
articles.published_at

courses.learning_path_id

modules.course_id

lessons.module_id

activities.lesson_id

user_progress.user_id
user_progress.lesson_id

notifications.user_id
notifications.is_read

audit_logs.user_id
audit_logs.entity_type
audit_logs.entity_id
```

Indexler gerçek query pattern'lerine göre optimize edilmelidir.

---

# 74. Flyway

Database migration Flyway ile yönetilmelidir.

Örnek:

```text
V1__create_users.sql
V2__create_roles.sql
V3__create_articles.sql
V4__create_learning_paths.sql
V5__create_courses.sql
V6__create_lessons.sql
V7__create_activities.sql
V8__create_progress.sql
```

Migration dosyaları sonradan değiştirilmemelidir.

Yeni değişiklik yeni migration olmalıdır.

---

# 75. Seed Data

Development ortamı için seed data bulunabilir.

Örnek:

Roles:

```text
USER
AUTHOR
EDITOR
ADMIN
```

Örnek Learning Path:

```text
Havacılığa Giriş
```

Örnek Course:

```text
Uçak Nasıl Çalışır?
```

Seed data production'da otomatik test kullanıcıları oluşturmamalıdır.

---

# 76. Backend Testing

Minimum test seviyeleri:

```text
Unit Test
Integration Test
Repository Test
Controller Test
Security Test
```

Kritik business logic test edilmelidir.

Özellikle:

- article state transition,
- authorization,
- quiz scoring,
- lesson completion,
- progress calculation,
- unlock logic

test edilmelidir.

---

# 77. Security Tests

Test edilmesi gerekenler:

```text
USER → ADMIN endpoint
AUTHOR → başka AUTHOR article
USER → başka user's progress
anonymous → protected endpoint
invalid JWT
expired JWT
```

Beklenen sonuç uygun authorization status code olmalıdır.

---

# 78. Article Acceptance Criteria

## AC-ARTICLE-001

GIVEN AUTHOR authenticated.

WHEN POST /articles çağrılır.

THEN article DRAFT olarak oluşturulur.

---

## AC-ARTICLE-002

GIVEN AUTHOR başka kullanıcının article'ına sahiptir.

WHEN update denenir.

THEN 403 dönmelidir.

---

## AC-ARTICLE-003

GIVEN article DRAFT durumundadır.

WHEN AUTHOR submit eder.

THEN status SUBMITTED olmalıdır.

---

## AC-ARTICLE-004

GIVEN article IN_REVIEW durumundadır.

WHEN EDITOR revision ister.

THEN status REVISION_REQUIRED olmalıdır.

AND revision comment kaydedilmelidir.

---

## AC-ARTICLE-005

GIVEN article APPROVED durumundadır.

WHEN EDITOR publish eder.

THEN status PUBLISHED olmalıdır.

AND publishedAt set edilmelidir.

---

# 79. Learning Acceptance Criteria

## AC-LEARNING-001

GIVEN kullanıcı lesson'a ilk kez erişir.

THEN progress IN_PROGRESS oluşturulmalıdır.

---

## AC-LEARNING-002

GIVEN required activities tamamlanmıştır.

WHEN completion değerlendirilir.

THEN lesson COMPLETED olmalıdır.

---

## AC-LEARNING-003

GIVEN prerequisite lesson tamamlanmamıştır.

WHEN kullanıcı locked lesson'a erişmeye çalışır.

THEN backend erişimi reddetmelidir.

---

# 80. Quiz Acceptance Criteria

## AC-QUIZ-001

GIVEN kullanıcı quiz başlatır.

THEN doğru cevaplar response içerisinde bulunmamalıdır.

---

## AC-QUIZ-002

GIVEN kullanıcı cevaplarını gönderir.

THEN score backend tarafından hesaplanmalıdır.

---

## AC-QUIZ-003

GIVEN score >= passingScore.

THEN attempt PASSED olmalıdır.

AND ilgili activity tamamlanmalıdır.

---

## AC-QUIZ-004

GIVEN score < passingScore.

THEN attempt FAILED olmalıdır.

AND kullanıcı maxAttempts aşılmadıysa tekrar deneyebilmelidir.

---

# 81. Progress Acceptance Criteria

## AC-PROGRESS-001

Bir activity tamamlandığında ilgili user activity progress kaydedilmelidir.

## AC-PROGRESS-002

Bir lesson tamamlandığında course progress yeniden hesaplanmalıdır.

## AC-PROGRESS-003

Tüm required lesson'lar tamamlandığında course COMPLETED olmalıdır.

## AC-PROGRESS-004

Course tamamlandığında bir sonraki course'un unlock koşulları değerlendirilmelidir.

---

# 82. Authorization Matrix

| İşlem | USER | AUTHOR | EDITOR | ADMIN |
|---|---:|---:|---:|---:|
| Article Read | ✓ | ✓ | ✓ | ✓ |
| Article Create | - | ✓ | ✓ | ✓ |
| Own Article Edit | - | ✓ | ✓ | ✓ |
| Other Article Edit | - | - | ✓ | ✓ |
| Article Submit | - | ✓ | ✓ | ✓ |
| Article Review | - | - | ✓ | ✓ |
| Article Publish | - | - | ✓ | ✓ |
| User Management | - | - | - | ✓ |
| Learning Read | ✓ | ✓ | ✓ | ✓ |
| Learning Create | - | - | ✓ | ✓ |
| Progress Read Own | ✓ | ✓ | ✓ | ✓ |
| Progress Read Others | - | - | - | ✓ |
| Simulation Start | ✓ | ✓ | ✓ | ✓ |
| Simulation Manage | - | - | ✓ | ✓ |
| Audit Logs | - | - | - | ✓ |

---

# 83. Backend Development Order

Backend development aşağıdaki sırayla ilerlemelidir.

## Phase 1

### Step 1

Project initialization.

### Step 2

Spring Boot configuration.

### Step 3

PostgreSQL connection.

### Step 4

Flyway.

### Step 5

User entity.

### Step 6

Role entity.

### Step 7

Authentication.

### Step 8

JWT.

### Step 9

Authorization.

---

## Phase 2

Article CMS:

```text
Article
Category
Tag
ArticleVersion
ArticleWorkflow
```

---

## Phase 3

Learning:

```text
LearningPath
Course
Module
Lesson
Activity
Dependency
```

---

## Phase 4

Assessment:

```text
Quiz
Question
Option
Attempt
```

---

## Phase 5

Progress:

```text
UserActivityProgress
UserLessonProgress
UserCourseProgress
```

---

## Phase 6

Simulation:

```text
SimulationTask
SimulationAttempt
```

---

## Phase 7

Community:

```text
Comment
Favorite
Notification
```

---

## Phase 8

Gamification:

```text
Achievement
UserAchievement
```

---

# 84. Backend Definition of Done

Bir backend feature aşağıdaki koşulları sağlamadan tamamlanmış kabul edilmez:

- Entity oluşturuldu.
- Database migration oluşturuldu.
- Repository oluşturuldu.
- Service business logic içeriyor.
- Controller endpointleri oluşturuldu.
- DTO kullanıldı.
- Validation eklendi.
- Authorization kontrolü yapıldı.
- Error handling yapıldı.
- Transaction ihtiyacı değerlendirildi.
- Database constraints tanımlandı.
- Unit test yazıldı.
- Gerekli integration test yazıldı.
- API documentation güncellendi.
- Acceptance criteria karşılandı.

---

# 85. Backend Coding Rules

Controller:

```text
HTTP handling
DTO mapping
Authorization boundary
```

işlerini yönetmelidir.

Service:

```text
Business logic
Transaction
State transition
Validation of business rules
```

işlerini yönetmelidir.

Repository:

```text
Database access
```

ile sınırlı olmalıdır.

Entity içerisine ağır business logic doldurulmamalıdır.

---

# 86. Kritik Kural

Frontend hiçbir zaman aşağıdaki bilgilerin source of truth'u değildir:

- user role
- article status
- lesson completion
- quiz score
- progress percentage
- lesson unlock state
- achievement eligibility

Bunların tamamı backend tarafından hesaplanmalı veya doğrulanmalıdır.

---

# 87. Faz 1 Backend Sonucu

Faz 1 sonunda backend aşağıdaki kullanıcı akışını tamamen desteklemelidir:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Learning Path
   ↓
Course
   ↓
Module
   ↓
Lesson
   ↓
Activity
   ↓
Quiz
   ↓
Score
   ↓
Progress
   ↓
Lesson Complete
   ↓
Next Lesson Unlock
```

Aynı zamanda:

```text
Author
   ↓
Create Article
   ↓
Draft
   ↓
Submit
   ↓
Editor
   ↓
Review
   ↓
Revision / Approval
   ↓
Publish
   ↓
User
   ↓
Read
```

akışı eksiksiz çalışmalıdır.

---

# 88. Gelecek Fazlara Açık Mimari

Backend Faz 1'de aşağıdaki özellikleri doğrudan implementation'a dahil etmek zorunda değildir ancak mimari bunların eklenmesine engel olmamalıdır:

- IVAO integration
- Microsoft Flight Simulator integration
- real-time flight tracking
- instructor accounts
- advanced scenario engine
- AI learning assistant
- adaptive learning
- browser-based cockpit
- real-time ATC simulation
- multiplayer learning
- advanced analytics

Bu özellikler Faz 1 kapsamını büyütmemelidir.

---

# 89. Product Philosophy

Backend yalnızca CRUD API değildir.

Sistemin temel business value'su:

```text
Content
+
Learning
+
Interaction
+
Assessment
+
Progress
+
Practice
```

kombinasyonudur.

Bu nedenle özellikle:

```text
Progress
Quiz
Lesson Completion
Unlock
Article Workflow
Authorization
```

alanları sıradan CRUD olarak uygulanmamalıdır.

Business rules backend'de merkezi olarak korunmalıdır.

---

# 90. Implementation Principle

Kodlama sırasında herhangi bir business rule belirsizliği oluştuğunda öncelik sırası:

1. Bu dokümandaki açık business rule.
2. İlgili acceptance criteria.
3. Database constraint.
4. Security / authorization requirement.
5. Standart Spring Boot yaklaşımı.

Yeni bir davranış gerekiyorsa mevcut davranışı sessizce değiştirmek yerine dokümana yeni bir requirement eklenmelidir.