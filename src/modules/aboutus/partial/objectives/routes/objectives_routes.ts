import express, { Request, Response, NextFunction } from 'express';
import objectivesController from '../controller/objectives_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, ObjectivesImageUpload } from 'helper/upload_helper';
import path from 'path';
import { validateObjectives } from '../validator/objectives_validator';

const router = express.Router();

router
  .route('/')
  .get(objectivesController.getBackground)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    ObjectivesImageUpload,
    (req: Request, res: Response, next: NextFunction): void => {
      const files = req.files as { [fieldname: string]: CustomFile[] };
      if (files['image[url]'] && files['image[url]'].length > 0) {
        const filename = path.basename(files['image[url]'][0].path);
        req.body.image = req.body.image || {};
        req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
      }

      next();
    },
    validateSchema(validateObjectives),
    objectivesController.createOrUpdate,
  );

router
  .route('/:id')
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    objectivesController.delete,
  );

export default router;
