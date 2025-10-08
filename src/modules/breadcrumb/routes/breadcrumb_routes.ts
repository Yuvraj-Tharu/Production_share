import express, { Request, Response, NextFunction } from 'express';
import BreadcrumController from '../controller/breadcrumb_controller';
import { CustomFile, breadcrumImageUpload } from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import {
  breadcrumbValidation,
  breadcrumbUpdateValidation,
} from '../validator/breadcrumb_validator';
import path from 'path';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  breadcrumImageUpload,
  (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(breadcrumbValidation),
  BreadcrumController.createBreadCrumb,
);

router.get('/', BreadcrumController.getBreadCrumb);

router.get('/:id', BreadcrumController.getBreadCrumbById);
router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  breadcrumImageUpload,
  (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    console.log(files);
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(breadcrumbUpdateValidation),
  BreadcrumController.updateBreadCrumb,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  BreadcrumController.deleteBreadCrumb,
);

export default router;
