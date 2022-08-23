import { Child, User } from '@prisma/client';

// merge User and Child into one type
export type UserChild = Child & {
  [K in keyof User]: User[K];
};

export function sanitizeChild(
  child: (Child & { user: User }) | null,
): UserChild | null {
  if (!child || !child.user) {
    return null;
  }
  const newChild = {
    ...child,
    ...child.user,
    type: 'Child' as const,
  };
  return newChild;
}
