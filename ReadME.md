# Project Sismakel

A full-stack modular project implementing Clean Architecture with NestJS backend and Vue.js frontend, designed for easy maintenance, scalability, and clear separation of concerns.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Clean Architecture](#clean-architecture)
- [Quick Start](#quick-start)
- [Implementation Status](#implementation-status)
- [Available Endpoints](#available-endpoints)
- [Creating New Modules](#creating-new-modules)
- [Frontend Features](#frontend-features)
- [Best Practices](#best-practices)
- [Development Guidelines](#development-guidelines)
- [Next Steps](#next-steps)

---

## 🎯 Overview

Project Sismakel is a modern full-stack application that implements **Clean Architecture** principles for maintainable and scalable code. The project separates concerns into clear layers: Domain, Application, Infrastructure, and Presentation.

### Key Benefits
- ✅ **Separation of Concerns**: Each layer has clear responsibilities
- ✅ **Testability**: Easy unit and integration testing
- ✅ **Maintainability**: Code is modular and easy to extend
- ✅ **Scalability**: Simple to add new features
- ✅ **Independence**: Business logic is framework-independent

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://docs.nestjs.com/) with TypeScript
- **Architecture**: Clean Architecture (Hexagonal)
- **Documentation**: Scalar API Reference
- **Validation**: class-validator & class-transformer
- **Database**: Prisma ORM (ready for integration)

### Frontend
- **Framework**: [Vue.js 3.5.17](https://vuejs.org/) with TypeScript
- **UI Framework**: [Vuetify 3.8.5](https://vuetifyjs.com/)
- **Admin Template**: Vuexy Admin Template
- **Build Tool**: [Vite 7.0.0](https://vitejs.dev/)
- **State Management**: [Pinia 3.0.2](https://pinia.vuejs.org/)
- **Routing**: Vue Router 4.5.1

## 📁 Project Structure

```
Sismakel/
├── backend/                     # NestJS Backend
│   ├── src/
│   │   ├── common/             # Shared utilities
│   │   │   ├── constants/      # App constants
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── dto/           # Shared DTOs
│   │   │   ├── enums/         # Enumerations
│   │   │   ├── exceptions/    # Custom exceptions
│   │   │   ├── filters/       # Exception filters
│   │   │   ├── guards/        # Auth guards
│   │   │   ├── interceptors/  # Response transformers
│   │   │   └── interfaces/    # TypeScript interfaces
│   │   ├── config/            # Configuration
│   │   ├── modules/           # Feature modules
│   │   │   ├── users/         # User module example
│   │   │   │   ├── domain/    # Business logic
│   │   │   │   ├── application/ # Use cases
│   │   │   │   ├── infrastructure/ # External concerns
│   │   │   │   └── presentation/ # Controllers
│   │   │   └── health/        # Health check
│   │   ├── app.module.ts      # Root module
│   │   ├── main.ts           # Application entry
│   │   └── openapi.json      # API specification
│   └── package.json
├── frontend/                   # Vue.js Frontend
│   ├── src/
│   │   ├── @core/            # Core utilities
│   │   ├── @layouts/         # Layout components
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Vue components
│   │   ├── composables/      # Vue composables
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/           # Page components
│   │   ├── plugins/         # Vue plugins
│   │   ├── utils/           # Utility functions
│   │   └── views/           # View components
│   └── package.json
└── README.md
```

## 🏗️ Clean Architecture

### Layer Structure

#### 1. 🎯 Domain Layer (Core Business Logic)
**Location**: `backend/src/modules/{module}/domain/`

**Responsibilities**:
- Business entities and domain objects
- Business rules and validations
- Repository interfaces (contracts)
- Service interfaces

**Example**:
```typescript
// domain/entities/user.entity.ts
export class User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(user: User): Promise<User>;
}
```

#### 2. 🔧 Application Layer (Use Cases)
**Location**: `backend/src/modules/{module}/application/`

**Responsibilities**:
- Use cases and application business rules
- Service implementations
- DTOs (Data Transfer Objects)
- Orchestration logic

#### 3. 🗄️ Infrastructure Layer (External Concerns)
**Location**: `backend/src/modules/{module}/infrastructure/`

**Responsibilities**:
- Repository implementations
- Database connections
- External API integrations
- File system operations

#### 4. 🌐 Presentation Layer (User Interface)
**Location**: `backend/src/modules/{module}/presentation/`

**Responsibilities**:
- Controllers (HTTP endpoints)
- Request/Response handling
- Input validation
- Authentication/Authorization

### Dependency Flow
```
Presentation → Application → Domain
     ↓              ↓           ↑
Infrastructure → Application → Domain
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run start:dev
   ```

4. **Access API**:
   - API Base: `http://localhost:3000/api/v1`
   - Documentation: `http://localhost:3000/docs`
   - Health Check: `http://localhost:3000/api/v1/health`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access Frontend**:
   - App: `http://localhost:5050`

## ✅ Implementation Status

### Backend (Completed)
- ✅ **Clean Architecture Structure**: All layers implemented
- ✅ **Scalar API Documentation**: Available at `/docs`
- ✅ **Common Components**: Decorators, guards, interceptors, filters
- ✅ **User Module**: Full CRUD with mock repository
- ✅ **Health Check**: Endpoint at `/api/v1/health`
- ✅ **Global Configuration**: Validation, CORS, API prefix
- ✅ **Role-based Access Control**: Admin, User, Moderator roles

### Frontend (Completed)
- ✅ **Vue.js 3.5.17**: Latest stable version
- ✅ **Vite 7.0.0**: Latest build tool
- ✅ **Vuetify 3.8.5**: Material Design components
- ✅ **Vuexy Admin Template**: Professional admin interface
- ✅ **ApexCharts 4.7.0**: Modern charts and visualizations
- ✅ **Pinia State Management**: Reactive state management

### Common Components
- ✅ **Constants**: Application constants
- ✅ **Decorators**: API response, current user, roles
- ✅ **DTOs**: Pagination with validation
- ✅ **Enums**: User roles (ADMIN, USER, MODERATOR)
- ✅ **Exceptions**: Custom exception handling
- ✅ **Filters**: HTTP exception filter
- ✅ **Guards**: Role-based access control
- ✅ **Interceptors**: Response transformation
- ✅ **Interfaces**: API response interfaces

## 🔗 Available Endpoints

### Health Check
- `GET /api/v1/health` - Application health status

### Users Module (Admin only)
- `GET /api/v1/users` - Get all users with pagination
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🏗️ Creating New Modules

### Quick Module Template

```bash
# Create module structure
src/modules/your-module/
├── domain/
│   ├── entities/your-entity.entity.ts
│   ├── repositories/your-repository.interface.ts
│   └── services/your-service.interface.ts
├── application/
│   ├── dto/
│   │   ├── create-your-entity.dto.ts
│   │   └── update-your-entity.dto.ts
│   └── services/your-service.ts
├── infrastructure/
│   └── repositories/your-repository.ts
├── presentation/
│   └── controllers/your-controller.ts
└── your-module.module.ts
```

### Implementation Steps

1. **Define Domain**: Create entities and interfaces
2. **Create DTOs**: Add validation with class-validator
3. **Implement Services**: Business logic in application layer
4. **Build Repository**: Data access in infrastructure layer
5. **Add Controller**: HTTP endpoints in presentation layer
6. **Register Module**: Add to app.module.ts

### Example Entity
```typescript
export class Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Frontend Features

### Vuexy Admin Template Features
- 📊 **Dashboard**: Analytics and charts with ApexCharts
- 👥 **User Management**: CRUD operations
- 🔐 **Authentication**: Login/logout functionality
- 📱 **Responsive Design**: Mobile-first approach
- 🌙 **Dark Mode**: Theme switching
- 🌐 **Internationalization**: Multi-language support
- 📋 **Data Tables**: Advanced table components
- 📄 **Forms**: Comprehensive form handling

### Vue.js 3 Features
- ⚡ **Composition API**: Modern reactive programming
- 🔧 **Script Setup**: Simplified component syntax
- 📦 **Pinia**: Next-generation state management
- 🚀 **Vite**: Lightning-fast development
- 🎯 **TypeScript**: Type safety throughout

## 📋 Best Practices

### Code Organization
- 📁 **Modular Structure**: Each feature in separate module
- 🎯 **Single Responsibility**: One responsibility per class/function
- 🔄 **Dependency Injection**: Use NestJS DI container
- 📝 **Interface Segregation**: Small, focused interfaces

### Error Handling
```typescript
// Custom exceptions
throw new CustomException('User not found', HttpStatus.NOT_FOUND);

// Global exception filter
@UseFilters(HttpExceptionFilter)
```

### Validation
```typescript
// DTO validation
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}
```

### Testing Strategy
- 🧪 **Unit Tests**: Domain logic and services
- 🔧 **Integration Tests**: Use cases and repositories
- 🌐 **E2E Tests**: API endpoints
- 🎨 **Component Tests**: Vue components

## 🛠️ Development Guidelines

### Backend Development
1. **Follow Clean Architecture**: Respect layer boundaries
2. **Use TypeScript**: Leverage type safety
3. **Validate Input**: Use DTOs with class-validator
4. **Handle Errors**: Use custom exceptions
5. **Document APIs**: Update OpenAPI specification

### Frontend Development
1. **Component Composition**: Use Vue 3 Composition API
2. **Type Safety**: Implement TypeScript throughout
3. **State Management**: Use Pinia for global state
4. **Responsive Design**: Mobile-first approach
5. **Performance**: Optimize with Vite build tools

### Git Workflow
1. **Feature Branches**: Create branches for new features
2. **Conventional Commits**: Use semantic commit messages
3. **Pull Requests**: Code review before merging
4. **Clean History**: Rebase and squash commits

## 🔮 Next Steps

### Backend Enhancements
- [ ] **Database Integration**: Connect Prisma with PostgreSQL/MySQL
- [ ] **JWT Authentication**: Implement secure authentication
- [ ] **File Upload**: Add file handling capabilities
- [ ] **Email Service**: Notification system
- [ ] **Rate Limiting**: API protection
- [ ] **Logging**: Application monitoring
- [ ] **Testing**: Unit and integration tests
- [ ] **Docker**: Containerization

### Frontend Enhancements
- [ ] **Authentication Integration**: Connect with backend auth
- [ ] **Real API Integration**: Replace mock data
- [ ] **PWA Features**: Service workers and offline support
- [ ] **Advanced Charts**: More visualization options
- [ ] **Theme Customization**: Brand-specific theming
- [ ] **Performance Optimization**: Code splitting and lazy loading

### DevOps & Deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Environment Configuration**: Development, staging, production
- [ ] **Monitoring**: Application performance monitoring
- [ ] **Security**: HTTPS, CORS, security headers

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue.js 3 Guide](https://vuejs.org/guide/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Project Sismakel** - Building scalable applications with Clean Architecture 🚀
