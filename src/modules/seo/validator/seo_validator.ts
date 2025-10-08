import { body } from 'express-validator';
import SeoModel, { SeoType } from '../model/seo_model';

export const validateSeoDocument = [
  body('metaTitle')
    .optional()
    .notEmpty()
    .withMessage('metaTitle cannot be empty')
    .bail()
    .isString()
    .withMessage('metaTitle must be a string'),
  body('metaDescription')
    .optional()
    .notEmpty()
    .withMessage('metaDescription cannot be empty')
    .bail()
    .isString()
    .withMessage('metaDescription must be a string'),
  body('ogTitle')
    .optional()
    .notEmpty()
    .withMessage('og title required')
    .isString()
    .withMessage('ogTitle must be a string'),
  body('ogDescription')
    .optional()
    .isString()
    .withMessage('ogDescription must be a string'),
  body('canonicalUrl')
    .optional()
    .notEmpty()
    .withMessage('canonicalUrl cannot be empty')
    .bail()
    .isString()
    .withMessage('canonicalUrl must be a string'),
  body('customHeader')
    .optional()
    .notEmpty()
    .withMessage('customHeader cannot be empty')
    .bail()
    .isString()
    .withMessage('customHeader must be a string'),
  body('ogImage')
  .optional({ checkFalsy: true })
  .isString()
  .withMessage('ogImage must be a string'),
  body('seoFor')
    .isIn(Object.values(SeoType))
    .withMessage(`Type must be one of: ${Object.values(SeoType).join(', ')}`)
    .custom(async (value) => {
      const existingSeo = await SeoModel.findOne({ seoFor: value });
      if (existingSeo) {
        throw new Error(`A Seo for '${value}' already exists.`);
      }
    }),
];
