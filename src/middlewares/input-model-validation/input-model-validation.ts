// src/middlewares/input-model-validation/input-model-validation.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const inputModelValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      message: error.msg,
      field: (error as any).path || (error as any).param || 'unknown'
    }));
    
    return res.status(400).json({
      errorsMessages: errorMessages
    });
  }
  
  next();
};
