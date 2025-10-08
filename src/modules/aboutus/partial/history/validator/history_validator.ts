import { check, checkSchema } from 'express-validator';

export const historyValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),
  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),
];

export const historyUpdateValidator = [
  check('title')
    .optional()
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),
];

export const historyUpdateOrderValidator = checkSchema({
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
