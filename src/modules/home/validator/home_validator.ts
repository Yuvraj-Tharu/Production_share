import { check } from 'express-validator';

export const homeValidation = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),
  check('subtitle')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),

  check('image.url').optional().bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image logo title must be a string')
    .bail(),
  check('image.caption')
    .optional()
    .isString()
    .withMessage('Image logo caption must be a string')
    .bail(),

  check('image.alt')
    .optional()
    .isString()
    .withMessage('Image logo alt text must be a string')
    .bail(),
];
