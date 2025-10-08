import { body, checkSchema } from 'express-validator';
export const presidentValidator = [
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
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .bail()
    .isString()
    .withMessage('Message must be a string'),

  body('joiningDate')
    .notEmpty()
    .withMessage('Joining Date is required')
    .bail()
    .isISO8601()
    .toDate()
    .withMessage('Joining Date must be a valid date'),
  body('resigningDate')
    .optional()
    .notEmpty()
    .withMessage('Resigning Date cannot be empty')
    .bail()
    .isISO8601()
    .toDate()
    .withMessage('Resigning Date must be a valid date'),
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

export const presidentUpdatetValidator = [
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
  body('message')
    .optional()
    .notEmpty()
    .withMessage('Message is required')
    .bail()
    .isString()
    .withMessage('Message must be a string'),

  body('joiningDate')
    .optional()
    .notEmpty()
    .withMessage('Joining Date is required')
    .bail()
    .isISO8601()
    .toDate()
    .withMessage('Joining Date must be a valid date'),
  body('resigningDate')
    .optional()
    .notEmpty()
    .withMessage('Resigning Date cannot be empty')
    .bail()
    .isISO8601()
    .toDate()
    .withMessage('Resigning Date must be a valid date'),
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
];
