# Aviation Platform

Tek Spring Boot backend. Feature-based modular monolith.

Repo: https://github.com/Mervearslan1/aviation-platform

- Ürün spec: [docs/backend-specification.md](docs/backend-specification.md)
- Java kuralları: [docs/java-guidelines.md](docs/java-guidelines.md)
- Mimari: [docs/architecture.md](docs/architecture.md)

## Paket yapısı

crmpanel1 ile aynı düzen: `common/` paylaşılan altyapı, `module/` iş özellikleri.

```text
com.aviation.platform
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
    ├── article/
    └── learning/        adım adım yol + progress
```

Öğrenme: önce **kule**. Dinle / konuş / senaryo / IVAO. Pilot hattı sonra. Udemy izle-bitir modeli yok.

Yazı editörü: http://localhost:8080/writer/index.html  
Kule ol: http://localhost:8080/tower/index.html  
Pilot (iskelet): http://localhost:8080/pilot/index.html  
Kule rehberi: docs/kule-egitim-rehberi.md

## Çalıştırma

```powershell
docker compose up -d
# Aviation Platform Postgres host port: 5433 (5432 bu makinede baska Postgres'e ait)
$env:AVIATION_ADMIN_EMAIL="admin@aviation-platform.local"
$env:AVIATION_ADMIN_PASSWORD="Admin123!"
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
  "email": "admin@aviation-platform.local",
  "password": "Admin123!"
}
```
