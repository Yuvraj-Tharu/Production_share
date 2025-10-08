import { check } from 'express-validator';

export const validateObjectives = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),

  check('image.url').notEmpty().withMessage('Image is required').bail(),

  check('listItems')
    .notEmpty()
    .withMessage('List items are required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('List items must be a non-empty array of strings'),
];
