import { body, check } from 'express-validator';

export const aboutUsValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long')
    .bail(),
  body('description').notEmpty().withMessage('Description is required').bail(),
  check('firstImage.url')
    .notEmpty()
    .withMessage('first Image is required')
    .bail(),
  check('firstImage.title')
    .optional()
    .notEmpty()
    .withMessage('first Image title is required')
    .bail(),
  check('firstImage.alt')
    .optional()
    .notEmpty()
    .withMessage('first Image alt is required')
    .bail(),
  check('firstImage.caption')
    .optional()
    .notEmpty()
    .withMessage(' first Image caption is required')
    .bail(),
  check('secondImage.url')
    .notEmpty()
    .withMessage('second Image is required')
    .bail(),
  check('secondImage.title')
    .optional()
    .notEmpty()
    .withMessage('second Image title is required')
    .bail(),
  check('secondImage.alt')
    .optional()
    .notEmpty()
    .withMessage('second Image alt is required')
    .bail(),
  check('secondImage.caption')
    .optional()
    .notEmpty()
    .withMessage(' second Image caption is required')
    .bail(),
];
