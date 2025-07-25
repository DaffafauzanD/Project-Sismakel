import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { LoginResponseDto } from '../application/dto/login-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Login user dengan username dan password, mengembalikan JWT token yang disimpan dalam cookie httpOnly',
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Username atau password salah',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);

    // Set JWT token in httpOnly cookie
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user dan menghapus JWT token dari cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout berhasil',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    // Clear the JWT cookie
    response.clearCookie('access_token');
    
    return {
      message: 'Logout berhasil',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Mendapatkan informasi profile user yang sedang login',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile user berhasil diambil',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token tidak valid',
  })
  async getProfile(@Req() request: Request) {
    // User information is available in request.user after JWT validation
    return {
      user: request.user,
    };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Verify JWT token',
    description: 'Memverifikasi apakah JWT token masih valid',
  })
  @ApiResponse({
    status: 200,
    description: 'Token valid',
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid',
  })
  async verifyToken(@Req() request: Request) {
    return {
      valid: true,
      user: request.user,
    };
  }
} 