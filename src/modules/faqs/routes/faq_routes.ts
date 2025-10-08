import express from 'express';
import { authenticateToken, checkRole } from '@middleware/auth';
import { validateSchema } from 'helper/validation_helper';

import FaqsController from '../controller/faqs_controller';
import {
  faqValidationRules,
  faqValidationUpdateRules,
} from '../validator/faq_validator';

const router = express.Router();

router
  .route('/')
  .get(FaqsController.getFaqs)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    validateSchema(faqValidationRules),
    FaqsController.createNewFaq,
  );

router
  .route('/:id')
  .get(FaqsController.getFaqById)
  .put(
    authenticateToken,
    checkRole(['superadmin']),
    validateSchema(faqValidationUpdateRules),
    FaqsController.updateFaq,
  )
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    FaqsController.deleteFaq,
  );

export default router;
