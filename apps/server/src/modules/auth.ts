import { z } from 'zod';

const loginInput = z.object({
  password: z.string().min(6).max(256),
  name: z.string().min(1).max(256),
});

const registerInput = z.object({
  password: z.string().min(6).max(256),
  name: z.string().min(1).max(256),
});

export { loginInput, registerInput };
