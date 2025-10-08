import express, { Response, Request, NextFunction } from 'express';
import BrandController from '../controller/accreditation_controller';
import {
  brandCreateValidation,
  brandUpdateValidation,
} from '../validator/accreditation_validator';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, brandImageUpload } from 'helper/upload_helper';
import { checkValidId } from 'helper/validation_helper';
import path from 'path';

const router = express.Router();

router
  .route('/')
  .get(BrandController.getAllBrand)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    brandImageUpload,
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
    BrandController.createBrand,
  );

router
  .route('/:id')
  .get(validateSchema([checkValidId('id')]), BrandController.getBrand)
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    validateSchema([checkValidId('id')]),
    BrandController.deleteBrand,
  )
  .put(
    authenticateToken,
    checkRole(['superadmin']),
    brandImageUpload,
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
    BrandController.updateBrand,
  );

export default router;
