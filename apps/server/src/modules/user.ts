import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { SortOrder } from '../interfaces/global-interfaces';
import { exclude } from '../services';

const updateUserInput = z.object({
  userId: z.number().min(1),
  values: z.object({
    name: z.string().min(1).max(256).optional(),
    sound: z.number().min(0).max(100).optional(),
  }),
});
const deleteUser = z.object({
  userId: z.number().min(1),
});
const getUserById = z.object({ id: z.number() });
const getAllUsers = z.object({
  offset: z.number().min(0).default(0),
  limit: z.number().min(1).max(50).default(20),
  orderBy: z
    .object({
      key: z.nativeEnum(exclude(Prisma.UserScalarFieldEnum, ['password'])),
      order: z.nativeEnum(SortOrder),
    })
    .optional(),
});

export { deleteUser, getAllUsers, getUserById, updateUserInput };
