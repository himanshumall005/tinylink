import { z } from 'zod'
import { isValidShortcode } from './utils'

export const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  code: z
    .string()
    .optional()
    .refine(
      (code) => !code || isValidShortcode(code),
      'Code must be 6-8 alphanumeric characters'
    ),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>

