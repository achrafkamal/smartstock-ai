export const authKeys = {
  all: ['auth'] as const,
  users: () => [...authKeys.all, 'users'] as const,
  user: (id: string) => [...authKeys.all, 'user', id] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};
