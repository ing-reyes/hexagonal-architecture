import { z } from 'zod';
import { Types } from 'mongoose';

export const mongoIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Must be a valid MongoDB ObjectId' }
);