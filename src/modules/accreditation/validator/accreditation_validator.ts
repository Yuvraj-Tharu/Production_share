import { check } from 'express-validator';

export const brandCreateValidation = [
  check('accreditationName')
    .notEmpty()
    .withMessage('Accreditation Name is required')
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
  check('accreditationName')
    .optional()
    .notEmpty()
    .withMessage('Accreditation Name is required')
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
