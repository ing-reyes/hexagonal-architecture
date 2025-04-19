import z from 'zod';

export const signInSchema = z.object({
    email: z.string().email("The email must be valid"),
    password: z.string().min(6, "The password must be at least 6 characters long"),
});

export const signUpSchema = z
    .object({
        name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
        email: z.string().email("The email must be valid").optional(),
        password: z.string().min(6, "The password must be at least 6 characters long").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "You must provide at least one field to update",
    })