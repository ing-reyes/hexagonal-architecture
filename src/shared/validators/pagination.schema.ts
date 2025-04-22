import { z } from 'zod';

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .refine((value) => !value || !isNaN(+value), {
            message: "Page must be a valid number",
        })
        .transform((value) => (value ? parseInt(value, 10) : 1))
        .default('1'),
    limit: z
        .string()
        .optional()
        .refine((value) => !value || !isNaN(+value), {
            message: "Limit must be a valid number",
        })
        .transform((value) => (value ? parseInt(value, 10) : 10))
        .default('10'),
});