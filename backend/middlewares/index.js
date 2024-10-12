import { ZodError } from "zod";

export function validateRequest(validators) {
  return async (req, res, next) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }

      next();
    } catch (err) {
      if (err instanceof Error) {
        if (err instanceof ZodError) res.status(400);
        next(err);
      }
    }
  };
}
