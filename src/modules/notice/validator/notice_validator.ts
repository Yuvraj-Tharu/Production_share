import { check } from 'express-validator';
import { NoticeModel } from '../model/notice_model';

export const blogValidationRules = [
  check('title').notEmpty().withMessage('Title is required'),
  check('image.url').notEmpty().withMessage('Image is required').bail(),
  check('image.title')
    .optional()
    .isString()
    .withMessage('Image title must be a string')
    .bail(),
  check('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .bail()
    .toLowerCase()
    .withMessage('Slug must be in lowercase')
    .bail()
    .custom(async (slug) => {
      const existing = await NoticeModel.findOne({ slug });
      if (existing) {
        throw new Error('Slug already exists');
      }
      return true;
    }),
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
  check('description').notEmpty().withMessage('Description is required'),
  check('category').notEmpty().withMessage('Category is required'),
];

export const blogUpdateValidationRules = [
  check('title').optional().notEmpty().withMessage('Title is required'),
  check('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .bail()
    .toLowerCase()
    .withMessage('Slug must be in lowercase')
    .bail()
    .custom(async (slug, { req }) => {
      const blogId = req.params?.id;
      const existing = await NoticeModel.findOne({ slug });
      if (
        existing &&
        typeof (existing as any)._id !== 'undefined' &&
        (existing as any)._id.toString() !== blogId
      ) {
        throw new Error('Slug already exists');
      }

      return true;
    }),
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
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description is required'),
  check('category').optional().notEmpty().withMessage('Category is required'),
];

export const blogCommentValidator = [
  check('comment').notEmpty().withMessage('Comment is required'),
  check('name').notEmpty().withMessage('Name is required'),
  check('email').notEmpty().withMessage('Email is required'),
];
