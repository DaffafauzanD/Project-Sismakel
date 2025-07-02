import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check for token in Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return super.canActivate(context);
    }
    
    // Check for token in cookies
    const token = request.cookies?.access_token;
    if (token) {
      // Set the token in Authorization header for passport-jwt strategy
      request.headers.authorization = `Bearer ${token}`;
      return super.canActivate(context);
    }
    
    throw new UnauthorizedException('No token provided');
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
} 