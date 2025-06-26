import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceInterface } from '../../domain/service/auth-service.interface';
import { AuthRepositoryInterface } from '../../domain/repositories/auth-repositories.interface';
import { LoginRequest, LoginResponse, JwtPayload } from '../../domain/entities/auth-entity';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('AuthRepositoryInterface')
    private readonly authRepository: AuthRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { username, password } = loginRequest;

    // Find user by username
    const user = await this.authRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.authRepository.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get role name from database
    const role = await this.getRoleName(user.id_role);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        role: role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async getRoleName(roleId: string): Promise<string> {
    try {
      const role = await this.prisma.mST_ROLE.findUnique({
        where: { id: roleId },
      });
      return role?.name || 'user';
    } catch (error) {
      return 'user';
    }
  }
} 