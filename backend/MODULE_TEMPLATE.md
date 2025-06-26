# Module Template Guide

Panduan untuk membuat module baru mengikuti Clean Architecture.

## 📁 Struktur Module

```
src/modules/your-module/
├── domain/
│   ├── entities/
│   │   └── your-entity.entity.ts
│   ├── repositories/
│   │   └── your-repository.interface.ts
│   └── services/
│       └── your-service.interface.ts
├── application/
│   ├── dto/
│   │   ├── create-your-entity.dto.ts
│   │   └── update-your-entity.dto.ts
│   └── services/
│       └── your-service.ts
├── infrastructure/
│   └── repositories/
│       └── your-repository.ts
├── presentation/
│   └── controllers/
│       └── your-controller.ts
└── your-module.module.ts
```

## 🔧 Langkah-langkah Implementasi

### 1. Domain Layer

#### Entity
```typescript
// domain/entities/your-entity.entity.ts
export class YourEntity {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<YourEntity>) {
    Object.assign(this, partial);
  }
}
```

#### Repository Interface
```typescript
// domain/repositories/your-repository.interface.ts
import { YourEntity } from '../entities/your-entity.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../../../common/interfaces/api-response.interface';

export interface IYourRepository {
  findAll(pagination: PaginationDto): Promise<PaginatedResponse<YourEntity>>;
  findById(id: string): Promise<YourEntity | null>;
  create(entity: Partial<YourEntity>): Promise<YourEntity>;
  update(id: string, entity: Partial<YourEntity>): Promise<YourEntity>;
  delete(id: string): Promise<void>;
}
```

#### Service Interface
```typescript
// domain/services/your-service.interface.ts
import { YourEntity } from '../entities/your-entity.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../../../common/interfaces/api-response.interface';

export interface IYourService {
  findAll(pagination: PaginationDto): Promise<PaginatedResponse<YourEntity>>;
  findById(id: string): Promise<YourEntity>;
  create(dto: CreateYourEntityDto): Promise<YourEntity>;
  update(id: string, dto: UpdateYourEntityDto): Promise<YourEntity>;
  delete(id: string): Promise<void>;
}
```

### 2. Application Layer

#### DTOs
```typescript
// application/dto/create-your-entity.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateYourEntityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

```typescript
// application/dto/update-your-entity.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateYourEntityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

#### Service Implementation
```typescript
// application/services/your-service.ts
import { Injectable } from '@nestjs/common';
import { YourEntity } from '../../domain/entities/your-entity.entity';
import { IYourService } from '../../domain/services/your-service.interface';
import { IYourRepository } from '../../domain/repositories/your-repository.interface';
import { CreateYourEntityDto, UpdateYourEntityDto } from '../dto';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class YourService implements IYourService {
  constructor(private readonly repository: IYourRepository) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<YourEntity>> {
    return this.repository.findAll(pagination);
  }

  async findById(id: string): Promise<YourEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new CustomException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  async create(dto: CreateYourEntityDto): Promise<YourEntity> {
    return this.repository.create({
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(id: string, dto: UpdateYourEntityDto): Promise<YourEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new CustomException('Entity not found', HttpStatus.NOT_FOUND);
    }

    return this.repository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new CustomException('Entity not found', HttpStatus.NOT_FOUND);
    }

    await this.repository.delete(id);
  }
}
```

### 3. Infrastructure Layer

#### Repository Implementation
```typescript
// infrastructure/repositories/your-repository.ts
import { Injectable } from '@nestjs/common';
import { YourEntity } from '../../domain/entities/your-entity.entity';
import { IYourRepository } from '../../domain/repositories/your-repository.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../../../common/interfaces/api-response.interface';

@Injectable()
export class YourRepository implements IYourRepository {
  private entities: YourEntity[] = [];

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<YourEntity>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const total = this.entities.length;
    const totalPages = Math.ceil(total / limit);

    const data = this.entities.slice(skip, skip + limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<YourEntity | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async create(entity: Partial<YourEntity>): Promise<YourEntity> {
    const newEntity = new YourEntity({
      ...entity,
      id: Math.random().toString(36).substr(2, 9),
    });
    this.entities.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<YourEntity>): Promise<YourEntity> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities[index] = { ...this.entities[index], ...entity };
    return this.entities[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.entities.splice(index, 1);
  }
}
```

### 4. Presentation Layer

#### Controller
```typescript
// presentation/controllers/your-controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { YourService } from '../../application/services/your-service';
import { CreateYourEntityDto, UpdateYourEntityDto } from '../../application/dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Controller('your-entities')
@UseGuards(RolesGuard)
export class YourController {
  constructor(private readonly service: YourService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateYourEntityDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateYourEntityDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
```

### 5. Module Definition

```typescript
// your-module.module.ts
import { Module } from '@nestjs/common';
import { YourController } from './presentation/controllers/your-controller';
import { YourService } from './application/services/your-service';
import { YourRepository } from './infrastructure/repositories/your-repository';

@Module({
  controllers: [YourController],
  providers: [YourService, YourRepository],
  exports: [YourService],
})
export class YourModule {}
```

### 6. Register Module

```typescript
// app.module.ts
import { YourModule } from './modules/your-module/your-module.module';

@Module({
  imports: [UsersModule, YourModule], // Add your module here
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
```

## 🎯 Best Practices

1. **Naming**: Gunakan nama yang deskriptif dan konsisten
2. **Validation**: Selalu validasi input di DTOs
3. **Error Handling**: Gunakan custom exceptions
4. **Testing**: Buat unit tests untuk setiap layer
5. **Documentation**: Dokumentasikan API endpoints

## 📝 Checklist

- [ ] Domain entities
- [ ] Repository interfaces
- [ ] Service interfaces
- [ ] DTOs dengan validation
- [ ] Service implementations
- [ ] Repository implementations
- [ ] Controllers
- [ ] Module definition
- [ ] Register di app.module.ts
- [ ] Unit tests
- [ ] API documentation 