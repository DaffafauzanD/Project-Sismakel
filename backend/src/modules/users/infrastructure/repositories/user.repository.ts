import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../../../common/interfaces/api-response.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.mST_USER.findMany({
        skip,
        take: limit,
        include: {
          MST_ROLE: {
            include: {
              MST_ROLE_PERMISSION: {
                include: {
                  MST_PERMISSION: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.mST_USER.count(),
    ]);

    return {
      data: data.map(u => mapUserPrismaToEntity(u)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.mST_USER.findUnique({
      where: { id },
      include: {
        MST_ROLE: {
          include: {
            MST_ROLE_PERMISSION: {
              include: {
                MST_PERMISSION: true,
              },
            },
          },
        },
      },
    });
    return user ? mapUserPrismaToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Jika ada field email di MST_USER, gunakan ini:
    // const user = await this.prisma.mST_USER.findUnique({ where: { email } });
    // return user ? new User(user) : null;
    // Jika tidak ada, return null:
    return null;
  }

  async create(user: Partial<User>): Promise<User> {
    const created = await this.prisma.mST_USER.create({
      data: {
        id: user.id,
        username: user.username!,
        password: user.password!,
        id_role: user.id_role!,
        create_at: user.create_at,
        update_at: user.update_at,
        create_by: user.create_by,
        update_by: user.update_by,
      },
    });
    return mapUserPrismaToEntity(created);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updated = await this.prisma.mST_USER.update({
      where: { id },
      data: {
        username: user.username,
        password: user.password,
        id_role: user.id_role,
        create_at: user.create_at,
        update_at: user.update_at,
        create_by: user.create_by,
        update_by: user.update_by,
      },
    });
    return mapUserPrismaToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mST_USER.delete({
      where: { id },
    });
  }
}

function mapUserPrismaToEntity(u: any): User {
  return new User({
    ...u,
    role: u.MST_ROLE ? {
      id: u.MST_ROLE.id,
      name: u.MST_ROLE.name,
      rolePermission: u.MST_ROLE.MST_ROLE_PERMISSION ? u.MST_ROLE.MST_ROLE_PERMISSION.map((rp: any) => ({
        id: rp.id,
        id_role: rp.id_role,
        id_permission: rp.id_permission,
        permission: {
          id: rp.MST_PERMISSION.id,
          name: rp.MST_PERMISSION.name,
        },
      })) : [],
    } : undefined,
    create_at: u.create_at ?? undefined,
    update_at: u.update_at ?? undefined,
    create_by: u.create_by ?? undefined,
    update_by: u.update_by ?? undefined,
  });
} 