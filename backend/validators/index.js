import * as z from "zod";
import { GPU_STATES } from "../constants.js";


export const getValidationSchema = (shape) => {
  let res = z.object({});

  for (const key in shape) {
    res = res.extend({
      [key]: shape[key],
    });
  }

  return res;
};

export const DatabaseIntIdParam = z.coerce.number().positive().min(1);

export const NewGPU = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Expected string.",
    })
    .min(5)
    .max(200),
  description: z
    .string({
      required_error: "Description is required.",
      invalid_type_error: "Expected string.",
    })
    .min(5)
    .max(400),
  imageUrl: z.string().url("Invalid image url").optional(),
  model: z
    .string({
      required_error: "Model is required.",
      invalid_type_error: "Expected string.",
    })
    .min(2)
    .max(100),
  brand: z
    .string({
      required_error: "Brand is required.",
      invalid_type_error: "Expected string.",
    })
    .min(2)
    .max(100),
  price: z.number().gte(1, { message: "Minimum allowed price is 1.00" }),
  status: z.enum(GPU_STATES).default(GPU_STATES[0]),
  //   seller: z.coerce.number().positive(),
});

export const NewGPUOptional = NewGPU.partial();

export const NewUser = z.object({
  email: z
    .string()
    .email({
      required_error: "Please enter a valid email address!",
    })
    .max(100)
    .trim()
    .toLowerCase(),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Expected string.",
    })
    .max(100)
    .trim(),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Expected string.",
    })
    .min(10)
    .max(50)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
      "Password must include an uppercase, lowercase, number, and special character."
    ),
});

export const UserCreds = z.object({
  email: z
    .string()
    .email({
      required_error: "Please enter a valid email address!",
    })
    .max(100)
    .trim()
    .toLowerCase(),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Expected string.",
    })
    .min(1),
});