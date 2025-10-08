import { body } from 'express-validator';

export const validateHomeSection = [
  body('title').notEmpty().withMessage('Title is required').bail(),
  body('description').notEmpty().withMessage('Description is required').bail(),
  body('firstImage.url')
    .optional()
    .isURL()
    .withMessage('First image URL must be valid'),
  body('firstImage.title')
    .optional()
    .isString()
    .withMessage('First image title must be a string'),
  body('firstImage.alt')
    .optional()
    .isString()
    .withMessage('First image alt must be a string'),

  body('secondImage.url')
    .optional()
    .isURL()
    .withMessage('Second image URL must be valid'),
  body('secondImage.title')
    .optional()
    .isString()
    .withMessage('Second image title must be a string'),
  body('secondImage.alt')
    .optional()
    .isString()
    .withMessage('Second image alt must be a string'),
];
