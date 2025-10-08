import express, { Response, Request, NextFunction } from 'express';
import SeoController from '../controller/seo_controller';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { validateSeoDocument } from '../validator/seo_validator';
import { CustomFile } from 'helper/upload_helper';
import path from 'path';
const router = express.Router();

router
  .route('/')
  .get(SeoController.getAllSeo)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    validateSchema(validateSeoDocument),
    SeoController.createSeo,
  );

router.get('/static/:type', SeoController.getSeoBySeoFor);

router
  .route('/:id')
  .get(SeoController.getSeoById)
  .put(authenticateToken, checkRole(['superadmin']), SeoController.updateSeo)
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    SeoController.deleteSeo,
  );

export default router;
