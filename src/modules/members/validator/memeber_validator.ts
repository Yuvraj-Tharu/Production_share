import { body, checkSchema } from 'express-validator';
export const teamCreateValidator = [
  body('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  body('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),

  body('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string'),

  body('position')
    .notEmpty()
    .withMessage('Position is required')
    .bail()
    .isString()
    .withMessage('Position must be a string'),

  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email address'),
];

export const teamUpdateOrderValidator = checkSchema({
  'body.*.id': {
    in: ['body'],
    isString: true,
    errorMessage: 'Each object must have a valid string id',
  },
  'body.*.displayPosition': {
    in: ['body'],
    isInt: true,
    toInt: true,
    errorMessage: 'Each object must have a valid integer displayPosition',
  },
});

export const teamUpdatetValidator = [
  body('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  body('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),

  body('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string'),

  body('position')
    .optional()
    .notEmpty()
    .withMessage('Position is required')
    .bail()
    .isString()
    .withMessage('Position must be a string'),

  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email address'),
];
