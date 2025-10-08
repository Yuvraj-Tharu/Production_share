import { check } from 'express-validator';

export const brandCreateValidation = [
  check('patnerName')
    .notEmpty()
    .withMessage('Our Patner Name is required')
    .bail(),
  check('image.url').notEmpty().withMessage('Image is required').bail(),
  check('image.title')
    .optional()
    .notEmpty()
    .withMessage('Image title is required')
    .bail(),
  check('image.alt')
    .optional()
    .notEmpty()
    .withMessage('Image alt is required')
    .bail(),
  check('image.caption')
    .optional()
    .notEmpty()
    .withMessage(' Image caption is required')
    .bail(),
];

export const brandUpdateValidation = [
  check('patnerName')
    .optional()
    .notEmpty()
    .withMessage('Our Patner Name is required')
    .bail(),
  check('image.url')
    .optional()
    .notEmpty()
    .withMessage('Image is required')
    .bail(),
  check('image.title')
    .optional()
    .notEmpty()
    .withMessage('Image title is required')
    .bail(),
  check('image.alt')
    .optional()
    .notEmpty()
    .withMessage('Image alt is required')
    .bail(),
  check('image.caption')
    .optional()
    .notEmpty()
    .withMessage(' Image caption is required')
    .bail(),
];
