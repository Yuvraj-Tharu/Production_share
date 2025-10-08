import { check, ValidationChain } from 'express-validator';
import BreadcrumbModel from '../model/breadcrumb_model';
import { BreadcrumbType } from '../model/breadcrumb_model';

export const breadcrumbValidation: ValidationChain[] = [
  check('title').notEmpty().withMessage('Title is required'),
  check('image.url').notEmpty().withMessage('Image is required').bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  check('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  check('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),
  check('type')
    .isIn(Object.values(BreadcrumbType))
    .withMessage(
      `Type must be one of: ${Object.values(BreadcrumbType).join(', ')}`,
    )
    .custom(async (value) => {
      const existingBreadcrumb = await BreadcrumbModel.findOne({ type: value });
      if (existingBreadcrumb) {
        throw new Error(`A breadcrumb with type '${value}' already exists.`);
      }
    }),
];

export const breadcrumbUpdateValidation: ValidationChain[] = [
  check('title').optional().notEmpty().withMessage('Title is required'),
  check('image.url')
    .optional()
    .notEmpty()
    .withMessage('Image is required')
    .bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  check('image.alt')
    .optional()
    .isString()
    .withMessage('Image alt text must be a string')
    .bail(),
  check('image.caption')
    .optional()
    .isString()
    .withMessage('Image caption must be a string')
    .bail(),
  check('type')
    .optional()
    .isIn(Object.values(BreadcrumbType))
    .withMessage(
      `Type must be one of: ${Object.values(BreadcrumbType).join(', ')}`,
    ),
];
