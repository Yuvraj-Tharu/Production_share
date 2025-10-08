import express from 'express';
import PrivacyController from '../controller/privacy_controller';
import { authenticateToken, checkRole } from '@middleware/auth';
import { validateSchema } from 'helper/validation_helper';
import { privacyalidator } from '../validator/privacy_validator';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(privacyalidator),
  PrivacyController.upsert,
);

router.get('/', PrivacyController.get);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  PrivacyController.delete,
);

export default router;
