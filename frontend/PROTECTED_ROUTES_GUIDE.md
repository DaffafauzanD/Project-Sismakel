# Protected Routes Guide

## Overview

This guide explains how to organize and implement protected routes in the Vue Sismakel application. All views that require authentication are stored in the `src/pages/protected/` directory.

## Directory Structure

```
src/pages/
├── protected/
│   ├── index.vue          # Redirects to dashboard
│   ├── dashboard.vue       # Main dashboard (requires auth)
│   ├── profile.vue         # User profile (requires auth)
│   ├── settings.vue        # User settings (requires auth)
│   ├── admin.vue           # Admin panel (requires ADMIN role)
│   └── users.vue           # User management (requires admin/moderator)
├── login.vue              # Public login page
├── unauthorized.vue        # Public unauthorized page
└── index.vue              # Public home page
```

## How to Create Protected Routes

### 1. Basic Protected Route

```vue
<script setup>
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
  },
})
</script>
```

### 2. Role-Based Protected Route

```vue
<script setup>
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'moderator'], // Only ADMIN and moderator can access
  },
})
</script>
```

### 3. Permission-Based Protected Route

```vue
<script setup>
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    permissions: ['user.read', 'user.write'], // Requires specific permissions
  },
})
</script>
```

### 4. Combined Role and Permission Protection

```vue
<script setup>
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'moderator'],
    permissions: ['user.read'],
  },
})
</script>
```

## Available Meta Options

| Option | Type | Description |
|--------|------|-------------|
| `requiresAuth` | Boolean | Set to `true` to require authentication |
| `roles` | Array | Array of allowed roles (e.g., `['ADMIN', 'user']`) |
| `permissions` | Array | Array of required permissions (e.g., `['user.read']`) |
| `layout` | String | Layout to use (e.g., `'default'`, `'blank'`) |
| `public` | Boolean | Set to `true` to make route public (overrides `requiresAuth`) |

## Available Roles

- `ADMIN` - Full system access
- `moderator` - Limited administrative access
- `user` - Standard user access

## Available Permissions

- `user.read` - Can read user data
- `user.write` - Can modify user data
- `user.delete` - Can delete users
- `admin.read` - Can read admin data
- `admin.write` - Can modify admin data
- `admin.delete` - Can delete admin data
- `moderator.read` - Can read moderator data
- `moderator.write` - Can modify moderator data

## Navigation Guards

The application uses navigation guards to protect routes:

1. **Authentication Check**: Verifies if user is logged in
2. **Role Check**: Verifies if user has required role
3. **Permission Check**: Verifies if user has required permissions
4. **Redirect Logic**: Redirects unauthorized users to appropriate pages

## Example Protected Pages

### Dashboard (`/protected/dashboard`)
- **Access**: All authenticated users
- **Meta**: `requiresAuth: true, roles: ['ADMIN', 'user', 'moderator']`
- **Purpose**: Main dashboard with role-based content

### Profile (`/protected/profile`)
- **Access**: All authenticated users
- **Meta**: `requiresAuth: true, roles: ['ADMIN', 'user', 'moderator']`
- **Purpose**: User profile management

### Settings (`/protected/settings`)
- **Access**: All authenticated users
- **Meta**: `requiresAuth: true, roles: ['ADMIN', 'user', 'moderator']`
- **Purpose**: User settings and preferences

### Admin Panel (`/protected/admin`)
- **Access**: Administrators only
- **Meta**: `requiresAuth: true, roles: ['ADMIN'], permissions: ['admin.read', 'admin.write']`
- **Purpose**: System administration

### User Management (`/protected/users`)
- **Access**: Administrators and moderators
- **Meta**: `requiresAuth: true, roles: ['ADMIN', 'moderator'], permissions: ['user.read', 'user.write']`
- **Purpose**: User management and administration

## Best Practices

1. **Always use `definePage`** with proper meta configuration
2. **Group related pages** in subdirectories if needed
3. **Use descriptive names** for your route files
4. **Test permissions** thoroughly before deployment
5. **Keep permissions granular** for better security control
6. **Document access requirements** in code comments

## Troubleshooting

### Common Issues

1. **Route not accessible**: Check if `requiresAuth` is set correctly
2. **Role denied**: Verify user has required role in auth store
3. **Permission denied**: Verify user has required permissions
4. **Redirect loop**: Check navigation guard logic

### Debug Tips

1. Check browser console for errors
2. Verify auth store state
3. Test with different user roles
4. Check route meta configuration

## Security Considerations

1. **Never trust client-side only**: Always verify permissions on the backend
2. **Use HTTPS**: Ensure secure communication
3. **Validate tokens**: Regularly verify JWT tokens
4. **Log access attempts**: Monitor unauthorized access attempts
5. **Regular audits**: Review permissions and roles regularly 