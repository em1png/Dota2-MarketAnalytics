import { z } from "zod";

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const SignupValidation = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const createItemValidation = z.object({
  heroName: z.string().min(2, {
    message: "Hero name must be at least 2 characters.",
  }),
  itemName: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  imageURL: z.string().min(2, {
    message: "Image URL must be at least 2 characters.",
  }),
});

export const CreateUserSellItemValidation = z.object({
  buyPrice: z.number().refine(value => !isNaN(value), { message: 'Invalid number' }),
  sellPrice: z.number().refine(value => !isNaN(value), { message: 'Invalid number' }),
  quantity: z.number().refine(value => !isNaN(value), { message: 'Invalid number' }),
});