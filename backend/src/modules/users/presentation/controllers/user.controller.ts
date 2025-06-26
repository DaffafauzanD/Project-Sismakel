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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UpdateUserDto } from '../../application/dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Roles(UserRole.ADMIN)
  async findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.ADMIN)
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
} 