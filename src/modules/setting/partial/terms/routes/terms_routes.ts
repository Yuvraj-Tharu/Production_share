import express from 'express';
import TermsController from '../controller/terms_controller';
import { authenticateToken, checkRole } from '@middleware/auth';
import { validateSchema } from 'helper/validation_helper';
import { termsValidator } from '../validator/terms_validator';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(termsValidator),
  TermsController.upsert,
);

router.get('/', TermsController.get);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  TermsController.delete,
);

export default router;
