import express, { Response, Request, NextFunction } from 'express';
import PatnerController from '../controller/ourpatner_controller';
import {
  brandCreateValidation,
  brandUpdateValidation,
} from '../validator/ourpatner_validator';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, PatnerImageUpload } from 'helper/upload_helper';
import { checkValidId } from 'helper/validation_helper';
import path from 'path';

const router = express.Router();

router
  .route('/')
  .get(PatnerController.getAllBrand)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    PatnerImageUpload,
    (req: Request, res: Response, next: NextFunction): void => {
      const files = req.files as { [fieldname: string]: CustomFile[] };

      if (files['image[url]'] && files['image[url]'].length > 0) {
        const filename = path.basename(files['image[url]'][0].path);
        req.body.image = req.body.image || {};
        req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
      }

      next();
    },
    validateSchema(brandCreateValidation),
    PatnerController.createBrand,
  );

router
  .route('/:id')
  .get(validateSchema([checkValidId('id')]), PatnerController.getBrand)
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    validateSchema([checkValidId('id')]),
    PatnerController.deleteBrand,
  )
  .put(
    authenticateToken,
    checkRole(['superadmin']),
    PatnerImageUpload,
    (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as { [fieldname: string]: CustomFile[] };
      if (files['image[url]'] && files['image[url]'].length > 0) {
        const filename = path.basename(files['image[url]'][0].path);
        req.body.image = req.body.image || {};
        req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
      }
      next();
    },
    brandUpdateValidation,
    PatnerController.updateBrand,
  );

export default router;
