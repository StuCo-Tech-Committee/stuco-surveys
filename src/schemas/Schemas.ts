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

export const responseSchema = z.object({
  surveyId: z.string(),
  date: z.string(),
  respondent: z.string().optional(),
  answers: z.array(
    z.object({
      choices: z.array(z.string()).optional(),
      number: z.number().optional(),
      text: z.string().optional(),
      file: z
        .object({
          name: z.string(),
          fileType: z.string(),
          data: z.instanceof(Buffer).optional(),
        })
        .optional(),
    })
  ),
});

export const respondentSchema = z.string().email();
