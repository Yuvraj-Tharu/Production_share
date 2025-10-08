import express, { Request, Response, NextFunction } from 'express';
import backgroundController from '../controller/background_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, backgroundImageUpload } from 'helper/upload_helper';
import path from 'path';
import { validateBackground } from '../validator/background_validator';

const router = express.Router();

router
  .route('/')
  .get(backgroundController.getBackground)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    backgroundImageUpload,
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
    validateSchema(validateBackground),
    backgroundController.createOrUpdate,
  );

router
  .route('/:id')
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    backgroundController.delete,
  );

export default router;
