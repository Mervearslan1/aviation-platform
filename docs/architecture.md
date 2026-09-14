# Aviation Platform — Backend Architecture

The backend is a **Feature-Based Modular Monolith**.

Coding rules: [java-guidelines.md](java-guidelines.md)

## Decision

ONE Spring Boot application. ONE deployment. ONE PostgreSQL.

Features are Java packages, not services and not separate apps.

```text
React Frontend
       │ HTTP / REST
       ▼
AviationPlatformApplication
       ├── auth
       ├── user
       ├── audit
       ├── course      (later)
       ├── lesson      (later)
       └── progress    (later)
       ▼
PostgreSQL
```

## Package-by-feature

```text
com.alp
├── auth/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│       ├── AuthService.java
│       └── AuthServiceImpl.java
├── user/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│       ├── UserService.java
│       └── UserServiceImpl.java
├── audit/
└── common/
```

Do not organize the root as `controller/`, `service/`, `repository/`.

## Request flow

```text
Controller → Service interface → ServiceImpl → Repository → PostgreSQL
```

- Controllers stay thin.
- Business rules live in `*ServiceImpl`.
- Features talk to each other through service interfaces, not repositories.
- `common/` is only for truly shared exception/response/util code.

## What this is not

Not microservices. Not Spring Cloud. Not separate databases or deployments.
A new feature such as quiz gets a `quiz/` package inside this same application.
