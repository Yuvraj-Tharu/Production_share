import express, { Response, Request, NextFunction } from 'express';
import AboutUsController from '../controller/about_us_controller';
import { aboutUsValidation } from '../validator/about_us_validator';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, aboutusImageUpload } from 'helper/upload_helper';
import path from 'path';
const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  aboutusImageUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['firstImage[url]'] && files['firstImage[url]'].length > 0) {
      const filename = path.basename(files['firstImage[url]'][0].path);
      req.body.firstImage = req.body.firstImage || {};
      req.body.firstImage.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    if (files['secondImage[url]'] && files['secondImage[url]'].length > 0) {
      const filename = path.basename(files['secondImage[url]'][0].path);
      req.body.secondImage = req.body.secondImage || {};
      req.body.secondImage.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(aboutUsValidation),
  AboutUsController.createAboutUs,
);

router.get('/', AboutUsController.getAboutUs);

export default router;
