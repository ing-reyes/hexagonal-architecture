import z from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("El email debe ser válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const updateUserSchema = z
    .object({
        name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
        email: z.string().email("El email debe ser válido").optional(),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar",
    })