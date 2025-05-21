import { z } from "zod";

const create_validation = z.object({
  body: z.object({
    name: z.string({
      required_error: "email is required z",
    }),
    img: z.array(z.string({
      required_error: "img is required",
    }), { required_error: "img is required" }).max(5, "cannot upload more then 5 images"),
    category: z.string({
      required_error: "category is required",
    }),
    sub_category: z.string({
      required_error: "sub category is required",
    }),
    description: z.string({
      required_error: "description is required",
    }),
    business: z.string({
      required_error: "business is required",
    }),
  }),
  cookies: z.string({
    required_error: "authorization is required",
  })
})
export const service_listing_validate = Object.freeze({
  create_validation
})