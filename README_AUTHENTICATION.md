# Authentication Implementation Guide

## Overview

This project implements a comprehensive authentication and authorization system using JWT tokens, role-based access control (RBAC), and permission-based access control (PBAC).

## Technologies Used

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component library
- **Pinia** - State management for Vue
- **Vue Router** - Client-side routing
- **JWT Decode** - JWT token decoding
- **Ofetch** - HTTP client
- **VueUse** - Vue composition utilities

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Database ORM
- **JWT** - JSON Web Tokens
- **Passport** - Authentication middleware
- **bcryptjs** - Password hashing
- **SQL Server** - Database

## Architecture

### Authentication Flow
1. User submits login credentials
2. Backend validates credentials and returns JWT token
3. Token is stored in httpOnly cookie
4. Frontend decodes token to get user information
5. User state is managed in Pinia store
6. Router guards protect routes based on authentication status

### Authorization Flow
1. Route meta contains required roles and permissions
2. Router guard checks user's role and permissions
3. Access is granted or denied based on requirements
4. Unauthorized users are redirected to appropriate pages

## Implementation Details

### Backend Implementation

#### 1. Authentication Controller (`/backend/src/modules/auth/presentation/auth.controller.ts`)

```typescript
@Post('login')
async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
  const result = await this.authService.login(loginDto);
  
  // Set JWT token in httpOnly cookie
  response.cookie('access_token', result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  return result;
}
```

#### 2. JWT Strategy (`/backend/src/common/strategies/jwt.strategy.ts`)

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      permission: payload.permission,
    };
  }
}
```

#### 3. Role Guard (`/backend/src/common/guards/roles.guard.ts`)

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Frontend Implementation

#### 1. Authentication Store (`/frontend/src/stores/auth.js`)

```javascript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed properties
  const userRole = computed(() => user.value?.role || null)
  const userPermissions = computed(() => user.value?.permission || [])
  const isAdmin = computed(() => userRole.value === 'ADMIN')

  // Methods
  const login = async (credentials) => {
    // Implementation
  }

  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission)
  }

  return {
    user, isAuthenticated, isLoading, error,
    userRole, userPermissions, isAdmin,
    login, logout, hasPermission
  }
})
```

#### 2. Router Guards (`/frontend/src/plugins/1.router/index.js`)

```javascript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check authentication
  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    const isValid = await authStore.verifyToken()
    if (!isValid) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  
  // Check roles
  const requiredRoles = to.meta?.roles
  if (requiredRoles && !requiredRoles.includes(authStore.userRole)) {
    return next({
      path: '/unauthorized',
      query: { 
        message: 'You do not have the required role to access this page',
        requiredRoles: requiredRoles.join(', '),
        currentRole: authStore.userRole
      }
    })
  }
  
  // Check permissions
  const requiredPermissions = to.meta?.permissions
  if (requiredPermissions && !requiredPermissions.some(p => authStore.userPermissions.includes(p))) {
    return next({
      path: '/unauthorized',
      query: { 
        message: 'You do not have the required permissions to access this page',
        requiredPermissions: requiredPermissions.join(', '),
        currentPermissions: authStore.userPermissions.join(', ')
      }
    })
  }
  
  next()
})
```

#### 3. Login Page (`/frontend/src/pages/login.vue`)

```vue
<script setup>
const { login, isLoading, error } = useAuth()

const form = ref({
  username: '',
  password: '',
  remember: false,
})

const handleLogin = async () => {
  try {
    await login({
      username: form.value.username,
      password: form.value.password,
    })
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>

<template>
  <VForm @submit.prevent="handleLogin">
    <AppTextField
      v-model="form.username"
      label="Username"
      :error-messages="errors.username"
      :disabled="isLoading"
    />
    <AppTextField
      v-model="form.password"
      label="Password"
      type="password"
      :error-messages="errors.password"
      :disabled="isLoading"
    />
    <VBtn
      type="submit"
      :loading="isLoading"
      :disabled="!isValid"
    >
      {{ isLoading ? 'Signing in...' : 'Login' }}
    </VBtn>
  </VForm>
</template>
```

#### 4. Protected Page (`/frontend/src/pages/protected.vue`)

```vue
<script setup>
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'user', 'moderator'],
    permissions: ['user.read'],
  },
})

const { 
  user, isAuthenticated, userRole, userPermissions,
  isAdmin, isUser, isModerator,
  hasPermission, hasAnyPermission, hasAllPermissions,
  hasRole, hasAnyRole, logout 
} = useAuth()

// Check specific permissions
const canReadUsers = computed(() => hasPermission('user.read'))
const canWriteUsers = computed(() => hasPermission('user.write'))
const canDeleteUsers = computed(() => hasPermission('user.delete'))

// Check multiple permissions
const canManageUsers = computed(() => hasAllPermissions(['user.read', 'user.write']))
const canDoAnyUserAction = computed(() => hasAnyPermission(['user.read', 'user.write', 'user.delete']))

// Check roles
const isAdminOrModerator = computed(() => hasAnyRole(['ADMIN', 'moderator']))
</script>

<template>
  <div class="protected-page">
    <!-- User Information -->
    <VCard>
      <VCardTitle>User Information</VCardTitle>
      <VCardText>
        <p>Username: {{ user?.username }}</p>
        <p>Role: {{ userRole }}</p>
        <p>Permissions: {{ userPermissions.join(', ') }}</p>
      </VCardText>
    </VCard>

    <!-- Role-based Content -->
    <div v-if="isAdmin">
      <VAlert type="error" variant="tonal">
        <VAlertTitle>Admin Panel</VAlertTitle>
        This content is only visible to administrators.
      </VAlert>
    </div>

    <div v-if="isModerator">
      <VAlert type="warning" variant="tonal">
        <VAlertTitle>Moderator Panel</VAlertTitle>
        This content is visible to moderators and admins.
      </VAlert>
    </div>

    <!-- Permission-based Content -->
    <div v-if="canReadUsers">
      <VAlert type="info" variant="tonal">
        <VAlertTitle>User Read Permission</VAlertTitle>
        You have permission to read user data.
      </VAlert>
    </div>

    <div v-if="canWriteUsers">
      <VAlert type="success" variant="tonal">
        <VAlertTitle>User Write Permission</VAlertTitle>
        You have permission to modify user data.
      </VAlert>
    </div>

    <div v-if="canDeleteUsers">
      <VAlert type="error" variant="tonal">
        <VAlertTitle>User Delete Permission</VAlertTitle>
        You have permission to delete users.
      </VAlert>
    </div>
  </div>
</template>
```

## Usage Examples

### 1. Route Protection

```javascript
// Public route
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

// Protected route with role requirement
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'moderator'],
  },
})

// Protected route with permission requirement
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    permissions: ['user.read', 'user.write'],
  },
})
```

### 2. Component-level Authorization

```vue
<template>
  <!-- Role-based rendering -->
  <div v-if="isAdmin">
    <AdminPanel />
  </div>
  
  <div v-if="isModerator">
    <ModeratorPanel />
  </div>
  
  <!-- Permission-based rendering -->
  <div v-if="hasPermission('user.read')">
    <UserList />
  </div>
  
  <div v-if="hasPermission('user.write')">
    <UserForm />
  </div>
  
  <!-- Multiple permission check -->
  <div v-if="hasAllPermissions(['user.read', 'user.write'])">
    <UserManagement />
  </div>
  
  <!-- Any permission check -->
  <div v-if="hasAnyPermission(['user.read', 'user.write', 'user.delete'])">
    <UserActions />
  </div>
</template>

<script setup>
const { 
  isAdmin, isModerator, 
  hasPermission, hasAllPermissions, hasAnyPermission 
} = useAuth()
</script>
```

### 3. API Calls with Authentication

```javascript
// The $api utility automatically includes the JWT token
const response = await $api('/users', {
  method: 'GET',
})

// For custom headers
const response = await $api('/admin/users', {
  method: 'POST',
  body: userData,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## Database Schema

### Users Table
```sql
CREATE TABLE MST_USER (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  username NVARCHAR(255) UNIQUE NOT NULL,
  password NVARCHAR(255) NOT NULL,
  id_role UNIQUEIDENTIFIER NOT NULL,
  create_at DATETIME DEFAULT GETDATE(),
  update_at DATETIME,
  create_by NVARCHAR(100),
  update_by NVARCHAR(100),
  FOREIGN KEY (id_role) REFERENCES MST_ROLE(id)
)
```

### Roles Table
```sql
CREATE TABLE MST_ROLE (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(100) UNIQUE NOT NULL,
  create_at DATETIME DEFAULT GETDATE(),
  update_at DATETIME,
  create_by NVARCHAR(100),
  update_by NVARCHAR(100)
)
```

### Permissions Table
```sql
CREATE TABLE MST_PERMISSION (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(255) NOT NULL,
  create_at DATETIME DEFAULT GETDATE(),
  update_at DATETIME,
  create_by NVARCHAR(100),
  update_by NVARCHAR(100)
)
```

### Role Permissions Table
```sql
CREATE TABLE MST_ROLE_PERMISSION (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  id_role UNIQUEIDENTIFIER NOT NULL,
  id_permission UNIQUEIDENTIFIER NOT NULL,
  create_at DATETIME DEFAULT GETDATE(),
  update_at DATETIME,
  create_by NVARCHAR(100),
  update_by NVARCHAR(100),
  FOREIGN KEY (id_role) REFERENCES MST_ROLE(id),
  FOREIGN KEY (id_permission) REFERENCES MST_PERMISSION(id)
)
```

## Demo Users

After running the seed script (`npm run db:seed`), the following demo users are available:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin | password123 | ADMIN | All permissions |
| user | password123 | user | user.read |
| moderator | password123 | moderator | user.read, user.write, moderator.read, moderator.write |

## Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **Password Hashing**: bcrypt with salt rounds
4. **Role-based Access Control**: Granular role management
5. **Permission-based Access Control**: Fine-grained permissions
6. **Route Guards**: Client and server-side protection
7. **Token Verification**: Automatic token validation
8. **Secure Headers**: CORS and security headers

## Error Handling

### Frontend Error Handling
```javascript
try {
  await login(credentials)
} catch (err) {
  // Handle login errors
  console.error('Login failed:', err)
  // Show user-friendly error message
}
```

### Backend Error Handling
```typescript
@Post('login')
async login(@Body() loginDto: LoginDto) {
  try {
    return await this.authService.login(loginDto)
  } catch (error) {
    throw new UnauthorizedException('Invalid credentials')
  }
}
```

## Testing

### Manual Testing
1. Start the backend: `npm run start:dev`
2. Start the frontend: `npm run dev`
3. Run database seed: `npm run db:seed`
4. Test login with demo users
5. Test protected routes with different roles
6. Test permission-based access

### Automated Testing
```javascript
// Example test for login
describe('AuthController', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'password123'
      })
      .expect(200)
    
    expect(response.body).toHaveProperty('access_token')
    expect(response.body.user).toHaveProperty('role', 'ADMIN')
  })
})
```

## Troubleshooting

### Common Issues

1. **Token not found**: Check if cookie is being set properly
2. **Permission denied**: Verify user has required permissions
3. **Role access denied**: Check user role assignment
4. **CORS errors**: Ensure backend CORS configuration
5. **Database connection**: Verify database connection string

### Debug Steps

1. Check browser developer tools for network requests
2. Verify JWT token in cookies
3. Check backend logs for authentication errors
4. Validate database user and role data
5. Test API endpoints directly with Postman

## Best Practices

1. **Always validate permissions on both client and server**
2. **Use httpOnly cookies for JWT storage**
3. **Implement proper error handling**
4. **Log authentication events for security**
5. **Regularly rotate JWT secrets**
6. **Use HTTPS in production**
7. **Implement rate limiting for login attempts**
8. **Add two-factor authentication for sensitive operations**

## Future Enhancements

1. **Refresh tokens** for better security
2. **Session management** for multiple devices
3. **Audit logging** for security events
4. **Multi-factor authentication**
5. **OAuth integration** (Google, GitHub, etc.)
6. **Password reset functionality**
7. **Account lockout after failed attempts**
8. **Real-time session monitoring**

## Support

For additional support:

1. Check the troubleshooting guide
2. Review the environment setup guide
3. Check the implementation summary
4. Review the architecture documentation

## Related Documentation

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Cookie Troubleshooting](./TROUBLESHOOTING_COOKIES.md) 