import { check } from 'express-validator';
export const validateBackground = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),
  check('firstDescription')
    .notEmpty()
    .withMessage('First Description is required')
    .bail()
    .isString()
    .withMessage('First Description must be a string'),
  check('firstImage.url')
    .notEmpty()
    .withMessage('First Image URL is required')
    .bail()
    .isString()
    .withMessage('First Image URL must be a string'),
  check('secondDescription')
    .notEmpty()
    .withMessage('Second Description is required')
    .bail()
    .isString()
    .withMessage('Second Description must be a string'),
  check('secondImage.url')
    .notEmpty()
    .withMessage('Second Image URL is required')
    .bail()
    .isString()
    .withMessage('Second Image URL must be a string'),
  check('fotterText')
    .optional()
    .notEmpty()
    .withMessage('Fotter Text cannot be empty if provided')
    .bail()
    .isString()
    .withMessage('Fotter Text must be a string'),
];
