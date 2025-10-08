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
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('position').isString().notEmpty().withMessage('Position is required'),
];

export const teamValidator = [
  body('experience')
    .optional()
    .notEmpty()
    .withMessage('Experience is required')
    .bail(),
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
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('position').isString().notEmpty().withMessage('Position is required'),
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
  body('name').optional().notEmpty().withMessage('Name is required').bail(),
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
  body('position')
    .optional()
    .notEmpty()
    .withMessage('Position is required')
    .bail(),
  body('displayPosition')
    .optional()
    .isInt()
    .withMessage('Display position is required and must be integer'),
];
