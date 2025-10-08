import express, { Response, Request, NextFunction } from 'express';
import SubscriptionController from '../controller/subscription_controller';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { checkValidId } from 'helper/validation_helper';
import { subscriptionCreateValidation } from '../validator/subscription_validator';
const router = express.Router();

router
  .route('/')
  .get(SubscriptionController.getSubscription)
  .post(
    validateSchema(subscriptionCreateValidation),
    SubscriptionController.createSubscription,
  );

router
  .route('/:id')
  .get(
    validateSchema([checkValidId('id')]),
    SubscriptionController.getSubscriptionById,
  )
  .delete(
    authenticateToken,
    validateSchema([checkValidId('id')]),
    SubscriptionController.deleteSubscription,
  )
  .put(
    authenticateToken,
    checkRole(['superadmin']),
    checkValidId('id'),
    validateSchema(subscriptionCreateValidation),
    SubscriptionController.updateSubscription,
  );

router.patch('/unsubscribe', SubscriptionController.unsubscribe);

export default router;
