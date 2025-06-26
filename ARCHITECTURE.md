# Clean Architecture Documentation

## Overview

Proyek ini mengimplementasikan **Clean Architecture** (juga dikenal sebagai Hexagonal Architecture) yang memisahkan aplikasi menjadi beberapa layer dengan tanggung jawab yang jelas.

## 🏗️ Layer Architecture

### 1. Domain Layer (Core Business Logic)

**Lokasi**: `src/modules/{module}/domain/`

**Tanggung Jawab**:
- Business entities (domain objects)
- Business rules dan validasi
- Repository interfaces
- Service interfaces

**Contoh Struktur**:
```
domain/
├── entities/
│   └── user.entity.ts          # Business entity
├── repositories/
│   └── user.repository.interface.ts  # Data access contract
└── services/
    └── user.service.interface.ts      # Business logic contract
```

**Karakteristik**:
- ❌ Tidak bergantung pada layer lain
- ✅ Berisi business logic murni
- ✅ Tidak tahu tentang database, HTTP, atau external services
- ✅ Framework independent

### 2. Application Layer (Use Cases)

**Lokasi**: `src/modules/{module}/application/`

**Tanggung Jawab**:
- Use cases (application business rules)
- Service implementations
- DTOs (Data Transfer Objects)
- Orchestration logic

**Contoh Struktur**:
```
application/
├── dto/
│   ├── create-user.dto.ts      # Input DTOs
│   └── update-user.dto.ts
└── services/
    └── user.service.ts         # Use case implementations
```

**Karakteristik**:
- ✅ Menggunakan domain entities
- ✅ Mengimplementasikan business logic
- ✅ Tidak bergantung pada infrastructure
- ✅ Framework independent

### 3. Infrastructure Layer (External Concerns)

**Lokasi**: `src/modules/{module}/infrastructure/`

**Tanggung Jawab**:
- Repository implementations
- Database connections
- External API integrations
- File system operations

**Contoh Struktur**:
```
infrastructure/
└── repositories/
    └── user.repository.ts      # Database implementation
```

**Karakteristik**:
- ✅ Mengimplementasikan domain interfaces
- ✅ Berisi external concerns
- ✅ Bisa bergantung pada framework
- ✅ Database, HTTP, file system

### 4. Presentation Layer (User Interface)

**Lokasi**: `src/modules/{module}/presentation/`

**Tanggung Jawab**:
- Controllers (HTTP endpoints)
- Request/Response handling
- Input validation
- Authentication/Authorization

**Contoh Struktur**:
```
presentation/
└── controllers/
    └── user.controller.ts      # HTTP endpoints
```

**Karakteristik**:
- ✅ Menggunakan application services
- ✅ Berisi HTTP concerns
- ✅ Framework dependent (NestJS)
- ✅ Input/output formatting

## 🔄 Dependency Flow

```
Presentation → Application → Domain
     ↓              ↓           ↑
Infrastructure → Application → Domain
```

**Aturan Dependencies**:
1. **Domain** tidak bergantung pada layer lain
2. **Application** hanya bergantung pada **Domain**
3. **Infrastructure** mengimplementasikan **Domain** interfaces
4. **Presentation** menggunakan **Application** services

## 📁 Common Layer

**Lokasi**: `src/common/`

**Tanggung Jawab**:
- Shared utilities
- Cross-cutting concerns
- Framework configurations

**Struktur**:
```
common/
├── constants/          # Application constants
├── decorators/         # Custom decorators
├── dto/               # Shared DTOs
├── enums/             # Shared enums
├── exceptions/        # Custom exceptions
├── filters/           # Exception filters
├── guards/            # Authentication guards
├── interceptors/      # Response transformers
└── interfaces/        # Shared interfaces
```

## 🎯 Benefits

### 1. Separation of Concerns
- Setiap layer memiliki tanggung jawab yang jelas
- Mudah untuk memahami dan memelihara

### 2. Testability
- Business logic dapat di-test secara terpisah
- Mock dependencies dengan mudah

### 3. Maintainability
- Perubahan di satu layer tidak mempengaruhi layer lain
- Kode lebih modular dan reusable

### 4. Scalability
- Mudah menambah fitur baru
- Mudah mengganti teknologi (database, framework)

### 5. Independence
- Business logic tidak bergantung pada framework
- Mudah untuk migrate ke teknologi lain

## 🔧 Implementation Guidelines

### 1. Creating a New Module

```bash
# Struktur yang direkomendasikan
src/modules/your-module/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── services/
├── application/
│   ├── dto/
│   └── services/
├── infrastructure/
│   └── repositories/
├── presentation/
│   └── controllers/
└── your-module.module.ts
```

### 2. Dependency Injection

```typescript
// Module definition
@Module({
  controllers: [YourController],
  providers: [
    YourService,
    YourRepository,
  ],
  exports: [YourService],
})
export class YourModule {}
```

### 3. Repository Pattern

```typescript
// Domain interface
export interface IYourRepository {
  findAll(): Promise<YourEntity[]>;
  findById(id: string): Promise<YourEntity>;
  create(entity: YourEntity): Promise<YourEntity>;
}

// Infrastructure implementation
@Injectable()
export class YourRepository implements IYourRepository {
  // Implementation
}
```

### 4. Service Pattern

```typescript
// Domain interface
export interface IYourService {
  getAll(): Promise<YourEntity[]>;
  getById(id: string): Promise<YourEntity>;
}

// Application implementation
@Injectable()
export class YourService implements IYourService {
  constructor(private repository: YourRepository) {}
  
  // Implementation
}
```

## 🚀 Best Practices

### 1. Naming Conventions
- **Entities**: `User`, `Product`, `Order`
- **Repositories**: `UserRepository`, `ProductRepository`
- **Services**: `UserService`, `ProductService`
- **Controllers**: `UserController`, `ProductController`
- **DTOs**: `CreateUserDto`, `UpdateUserDto`

### 2. Error Handling
- Gunakan custom exceptions di domain layer
- Handle errors di presentation layer
- Log errors di infrastructure layer

### 3. Validation
- Input validation di DTOs
- Business validation di domain entities
- Use class-validator decorators

### 4. Testing
- Unit tests untuk domain logic
- Integration tests untuk use cases
- E2E tests untuk API endpoints

## 📚 Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) 