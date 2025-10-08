import express, { Request, Response, NextFunction } from 'express';
import HomeController from '../controller/home_controller';
import { homeValidation } from '../validator/home_validator';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, homeImageUpload } from 'helper/upload_helper';
import path from 'path';

const router = express.Router();

router.route('/').post(
  authenticateToken,
  checkRole(['superadmin']),
  homeImageUpload,
  (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(homeValidation),
  HomeController.createOrUpdate,
);

router.route('/').get(HomeController.get);

export default router;
