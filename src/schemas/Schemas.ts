import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const surveySchema = z.object({
  _id: z.string(),
  name: z.string(),
  creator: z.string(),
  description: z.string(),
  identifiable: z.boolean(),
  published: z.boolean(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  elements: z.array(
    z
      .object({
        id: z.string(),
        type: z.string(),
        title: z.string(),
        description: z.string(),
        required: z.boolean(),
        choices: z.array(z.string()),
        range: z.array(z.union([z.number(), z.undefined()])),
        step: z.number(),
        validator: z.string(),
      })
      .partial()
  ),
});

export const creatorSchema = z.string().email();

export const idSchema = z.string().refine((id) => ObjectId.isValid(id));
