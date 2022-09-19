import type { Child, Parent, User } from '@prisma/client';

// merge User and Child into one type
export type UserChild = Child & {
  [K in keyof User]: User[K];
};

// merge User and Child into one type
export type UserParent = Parent & {
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

export function sanitizeParent(
  parent: (Parent & { user: User }) | null,
): UserParent | null {
  if (!parent || !parent.user) {
    return null;
  }
  const newParent = {
    ...parent,
    ...parent.user,
    type: 'Parent' as const,
  };
  return newParent;
}
