import { check } from 'express-validator';

export const faqValidationRules = [
  check('question').notEmpty().withMessage('Question is required').bail(),
  check('answer').notEmpty().withMessage('Answer is required').bail(),
];

export const faqValidationUpdateRules = [
  check('question')
    .optional()
    .notEmpty()
    .withMessage('Question is required')
    .bail(),
  check('answer')
    .optional()
    .notEmpty()
    .withMessage('Answer is required')
    .bail(),
];
