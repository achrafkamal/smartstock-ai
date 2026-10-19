export const stockKeys = {
  all: ['stock'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...stockKeys.lists(), { filters }] as const,
};
