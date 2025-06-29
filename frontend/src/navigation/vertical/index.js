export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'tabler-file' },
  },
  {
    title: 'Protected',
    icon: { icon: 'tabler-shield-lock' },
    children: [
      {
        title: 'Dashboard',
        to: { name: 'protected-dashboard' },
        icon: { icon: 'tabler-dashboard' },
      },
      {
        title: 'Profile',
        to: { name: 'protected-profile' },
        icon: { icon: 'tabler-user' },
      },
      {
        title: 'Settings',
        to: { name: 'protected-settings' },
        icon: { icon: 'tabler-settings' },
      },
      {
        title: 'Admin Panel',
        to: { name: 'protected-admin' },
        icon: { icon: 'tabler-crown' },
        meta: {
          roles: ['ADMIN'],
        },
      },
      {
        title: 'User Management',
        to: { name: 'protected-users' },
        icon: { icon: 'tabler-users' },
        meta: {
          roles: ['ADMIN', 'moderator'],
        },
      },
    ],
  },
]
