import { body } from 'express-validator';

export const settingValidation = [
  body('headerLogo.url').optional().bail(),
  body('headerLogo.title')
    .optional()
    .isString()
    .withMessage('Header logo title must be a string')
    .bail(),
  body('headerLogo.caption')
    .optional()
    .isString()
    .withMessage('Header logo caption must be a string')
    .bail(),

  body('headerLogo.alt')
    .optional()
    .isString()
    .withMessage('Header logo alt text must be a string')
    .bail(),
  body('footerLogo.url').optional().bail(),
  body('footerLogo.title')
    .optional()
    .isString()
    .withMessage('Footer logo title must be a string')
    .bail(),

  body('footerLogo.caption')
    .optional()
    .isString()
    .withMessage('Footer logo caption must be a string')
    .bail(),
  body('footerLogo.alt')
    .optional()
    .isString()
    .withMessage('Footer logo alt text must be a string')
    .bail(),
  body('phoneNumber').notEmpty().withMessage('Phone number is required').bail(),
  body('location').notEmpty().withMessage('Location is required').bail(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .bail(),
  body('opeingHours')
    .optional()
    .notEmpty()
    .withMessage('Opening_hours is required')
    .bail(),
  body('copyRight')
    .notEmpty()
    .withMessage('Copy right text is required')
    .bail(),
  body('socialMedia.facebook')
    .optional()
    .isString()
    .withMessage('Facebook URL must be a string')
    .bail(),
  body('mapUrl').notEmpty().withMessage('Map URL is required'),
  body('socialMedia.youtube')
    .optional()
    .isString()
    .withMessage('Youtube URL must be a string')
    .bail(),
  body('socialMedia.pinterest')
    .optional()
    .isString()
    .withMessage('Pinterest URL must be a string')
    .bail(),
  body('socialMedia.instagram')
    .optional()
    .isString()
    .withMessage('Instagram URL must be a string')
    .bail(),
  body('socialMedia.linkedin')
    .optional()
    .isString()
    .withMessage('LinkedIn URL must be a string')
    .bail(),
  body('socialMedia.youtube')
    .optional()
    .isString()
    .withMessage('YouTube URL must be a string')
    .bail(),
  body('socialMedia.tiktok')
    .optional()
    .isString()
    .withMessage('TikTok URL must be a string')
    .bail(),
  body('socialMedia.')
    .optional()
    .isString()
    .withMessage('WhatsApp  must be a string')
    .bail(),
  body('footerDescription')
    .optional()
    .isString()
    .withMessage('Footer description must be a string')
    .bail(),

  body('staffEmail.general')
    .optional()
    .notEmpty()
    .withMessage('General staff email is required')
    .bail()
    .isEmail()
    .withMessage('General staff email must be valid')
    .bail(),

  body('staffEmail.jobs')
    .optional()
    .notEmpty()
    .withMessage('Jobs staff email is required')
    .bail()
    .isEmail()
    .withMessage('Jobs staff email must be valid'),

  body('staffEmail.employers')
    .optional()
    .notEmpty()
    .withMessage('Employers staff email is required')
    .bail()
    .isEmail()
    .withMessage('Employers staff email must be valid'),

  body('staffEmail.support')
    .optional()
    .notEmpty()
    .withMessage('Support staff email is required')
    .bail()
    .isEmail()
    .withMessage('Support staff email must be valid'),

  body('staffPhoneNumber.Main')
    .optional()
    .notEmpty()
    .withMessage('Main staff phone number is required')
    .bail()
    .isString()
    .withMessage('Main staff phone number must be a string'),
  body('staffPhoneNumber.HR')
    .optional()
    .notEmpty()
    .withMessage('HR staff phone number is required')
    .bail()
    .isString()
    .withMessage('HR staff phone number must be a string'),

  body('staffPhoneNumber.Recruitment')
    .optional()
    .notEmpty()
    .withMessage('Recruitment staff phone number is required')
    .bail()
    .isString()
    .withMessage('Recruitment staff phone number must be a string'),

  body('officeLocation.name')
    .optional()
    .isString()
    .withMessage('Office location name must be a string')
    .bail(),
  body('officeLocation.address')
    .optional()
    .isString()
    .withMessage('Office location address must be a string')
    .bail(),
  body('officeLocation.state')
    .optional()
    .isString()
    .withMessage('Office location state must be a string')
    .bail(),
  body('officeLocation.country')
    .optional()
    .isString()
    .withMessage('Office location country must be a string')
    .bail(),
  body('officeLocation.zipCode')
    .optional()
    .isString()
    .withMessage('Office location zip code must be a string')
    .bail(),
];
