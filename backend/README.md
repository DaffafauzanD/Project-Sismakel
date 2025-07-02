<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sismakel Backend API

Backend API untuk aplikasi Sismakel yang dibangun dengan NestJS menggunakan Clean Architecture dan Scalar API Documentation.

## 🏗️ Arsitektur

Proyek ini menggunakan **Clean Architecture** dengan struktur sebagai berikut:

```
src/
├── common/                    # Shared components
│   ├── constants/            # Application constants
│   ├── decorators/           # Custom decorators
│   ├── dto/                  # Data Transfer Objects
│   ├── enums/                # Enumerations
│   ├── exceptions/           # Custom exceptions
│   ├── filters/              # Exception filters
│   ├── guards/               # Authentication/Authorization guards
│   ├── interceptors/         # Response transformers
│   └── interfaces/           # TypeScript interfaces
├── config/                   # Configuration files
├── modules/                  # Feature modules (Clean Architecture)
│   └── users/               # User module example
│       ├── domain/          # Business logic & entities
│       ├── application/     # Use cases & services
│       ├── infrastructure/  # External concerns (DB, APIs)
│       └── presentation/    # Controllers & DTOs
└── main.ts                  # Application entry point
```

### Clean Architecture Layers:

1. **Domain Layer** (`domain/`)
   - Entities: Business objects
   - Repository interfaces: Data access contracts
   - Service interfaces: Business logic contracts

2. **Application Layer** (`application/`)
   - Use cases: Application business rules
   - DTOs: Data transfer objects
   - Service implementations: Business logic

3. **Infrastructure Layer** (`infrastructure/`)
   - Repository implementations: Data access
   - External service integrations
   - Database configurations

4. **Presentation Layer** (`presentation/`)
   - Controllers: HTTP endpoints
   - Request/Response handling
   - Validation

## 🚀 Fitur

- ✅ **Clean Architecture** - Separation of concerns
- ✅ **Scalar API Documentation** - Interactive API docs
- ✅ **Role-based Access Control** - User roles & permissions
- ✅ **Exception Handling** - Consistent error responses
- ✅ **Response Transformation** - Standardized API responses
- ✅ **Pagination** - Built-in pagination support
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Environment Configuration** - Flexible config management

## 📚 API Documentation

API documentation tersedia di: `http://localhost:3000/docs`

### Endpoints yang tersedia:

- `GET /api/v1/health` - Health check
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `POST /api/v1/users` - Create new user (Admin only)
- `PUT /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

## 🛠️ Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env file sesuai konfigurasi Anda
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run start:dev
   ```

## 📝 Scripts

- `npm run start:dev` - Development server dengan hot reload
- `npm run build` - Build production
- `npm run start:prod` - Run production server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## 🔧 Konfigurasi

### Environment Variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sismakel?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=http://localhost:3001
```

## 🏛️ Clean Architecture Benefits

1. **Separation of Concerns** - Setiap layer memiliki tanggung jawab yang jelas
2. **Testability** - Mudah untuk unit testing
3. **Maintainability** - Kode mudah dipelihara dan diperluas
4. **Scalability** - Mudah untuk menambah fitur baru
5. **Dependency Inversion** - Dependencies mengarah ke abstractions

## 📁 Struktur Module

Setiap module mengikuti struktur Clean Architecture:

```
module-name/
├── domain/
│   ├── entities/           # Business entities
│   ├── repositories/       # Repository interfaces
│   └── services/          # Service interfaces
├── application/
│   ├── dto/               # Data Transfer Objects
│   └── services/          # Service implementations
├── infrastructure/
│   └── repositories/      # Repository implementations
├── presentation/
│   └── controllers/       # HTTP controllers
└── module-name.module.ts  # Module definition
```

## 🔐 Authentication & Authorization

Sistem menggunakan role-based access control dengan roles:
- `ADMIN` - Full access
- `MODERATOR` - Limited admin access
- `USER` - Basic user access

## 📊 Response Format

Semua API responses mengikuti format standar:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow Clean Architecture principles
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
