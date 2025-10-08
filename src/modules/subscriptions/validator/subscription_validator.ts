import { check } from 'express-validator';
import SubscriptionModel from '../model/subscription_model';

const nameUniqueCheck = async (email: string, { req }: any) => {
  const emailId = req.params.id;
  const emailExists = await SubscriptionModel.findOne({
    email,
    status: false,
    ...(emailId && { _id: { $ne: emailId } }),
  });

  if (emailExists) {
    throw new Error('Already subscribed');
  }
};

export const subscriptionCreateValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is required')
    .trim()
    .custom(nameUniqueCheck)
    .bail(),

  check('terms').optional().isBoolean().withMessage('Terms is required').trim(),
];
