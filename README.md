# Aviation Platform

Tek Spring Boot backend. Feature-based modular monolith.

Repo: https://github.com/Mervearslan1/aviation-platform

- Ürün spec: [docs/backend-specification.md](docs/backend-specification.md)
- Java kuralları: [docs/java-guidelines.md](docs/java-guidelines.md)
- Mimari: [docs/architecture.md](docs/architecture.md)

## Paket yapısı

crmpanel1 ile aynı düzen: `common/` paylaşılan altyapı, `module/` iş özellikleri.

```text
com.alp
├── AviationPlatformApplication.java
├── common/
│   ├── config/          Security, OpenAPI, AppConfig
│   ├── exception/handler/
│   ├── security/jwt|entrypoint|principal
│   ├── validation/
│   └── response, pagination, util
└── module/
    ├── auth/
    ├── user/
    ├── audit/
    └── article/         blog: taslak → inceleme → yayın, zengin içerik, medya
```

Course / lesson şimdilik yok. Önce blog.

Yazı editörü (Word benzeri): http://localhost:8080/writer/index.html

## Çalıştırma

```powershell
docker compose up -d
# ALP Postgres host port: 5433 (5432 bu makinede baska Postgres'e ait)
$env:ALP_ADMIN_EMAIL="admin@alp.local"
$env:ALP_ADMIN_PASSWORD="Admin123!"
.\mvnw.cmd spring-boot:run
```

## Swagger

Uygulama ayağa kalktıktan sonra: http://localhost:8080/swagger-ui.html

1. **Auth → POST /register** veya **POST /login** çalıştır (`Try it out`).
2. Response içindeki `accessToken` değerini kopyala.
3. Sağ üstteki **Authorize** → token'ı yapıştır → Authorize.
4. **Users** ve **Audit** endpoint'lerini dene.

Login örneği:

```json
{
  "email": "pilot01@example.com",
  "password": "Password123!"
}
```

Admin seed kullandıysan:

```json
{
  "email": "admin@alp.local",
  "password": "Admin123!"
}
```
