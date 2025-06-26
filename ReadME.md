# Project Sismakel

A modular backend project using Clean Architecture and NestJS, designed for easy maintenance, scalability, and clear separation of concerns.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Implementation Summary](#implementation-summary)
- [Module Template & Guide](#module-template--guide)
- [Quick Start](#quick-start)
- [Available Endpoints](#available-endpoints)
- [Use Case Example](#use-case-example)
- [Best Practices](#best-practices)
- [Next Steps](#next-steps)
- [Resources](#resources)
- [License](#license)
- [Contact](#contact)

---

## Overview

Project Sismakel implements **Clean Architecture** (Hexagonal Architecture), separating the application into clear layers: Domain, Application, Infrastructure, and Presentation. This ensures each layer has a single responsibility, making the app easier to maintain and extend.

## Features

- Modular codebase with separation of concerns
- Built with [NestJS](https://docs.nestjs.com/) and [TypeScript](https://www.typescriptlang.org/docs/)
- Follows Clean Architecture principles
- Integrated OpenAPI documentation ([Scalar API Reference](http://localhost:3000/docs))
- Role-based authentication/authorization (ready for expansion)
- Easily testable and maintainable

## Folder Structure
```
src/
├── common/ # Shared utilities, DTOs, guards, etc.
├── config/ # Configuration files
├── modules/
│   ├── users/ # Example: User module
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── users.module.ts
│   └── health/ # Health check module
├── app.module.ts # Root module
├── main.ts # Application entrypoint
└── openapi.json # OpenAPI spec
```

## Architecture

### Layered Structure

#### 1. Domain Layer (Core Business Logic)
- Location: `src/modules/{module}/domain/`
- Contains business entities, rules, repository & service interfaces
- Pure business logic, framework-independent

#### 2. Application Layer (Use Cases)
- Location: `src/modules/{module}/application/`
- Contains use case implementations, DTOs, orchestration logic
- Depends only on Domain layer

#### 3. Infrastructure Layer (External Concerns)
- Location: `src/modules/{module}/infrastructure/`
- Implements repositories, database, API integrations, etc.

#### 4. Presentation Layer (User Interface)
- Location: `src/modules/{module}/presentation/`
- Contains controllers, request/response handling, validation

#### Dependency Flow
Presentation → Application → Domain ↓ ↓ ↑ Infrastructure → Application → Domain

- Only flow dependencies inwards, never outwards

#### Common Layer
- Location: `src/common/`
- Shared utilities, DTOs, decorators, guards, exceptions, etc.

---

## Implementation Summary

### Implemented

- Scalar API documentation at `/docs`
- Clean Architecture structure in all modules
- Common components: constants, decorators, DTOs, enums, exceptions, filters, guards, interceptors, interfaces, pipes
- Example User module: full CRUD (mock repository)
- Health check at `/api/v1/health`
- Global configuration: validation, interceptors, filters, CORS, API prefix

### How to Run

1. **Install dependencies:**
   ```bash
   npm install

### Module Template & Guide
To create a new module, follow this structure:
```
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
#### Implementation Steps
- Define entities, repository & service interfaces (domain)
- Create DTOs & service implementation (application)
- Implement repository (infrastructure)
- Build controllers (presentation)
- Register the module in app.module.ts

## Available Endpoints
