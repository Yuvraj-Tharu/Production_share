import express, { Request, Response, NextFunction } from 'express';
import presidentController from '../controller/president_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import {
  presidentUpdatetValidator,
  teamUpdateOrderValidator,
  presidentValidator,
} from '../validator/president_validator';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, presidentImageUpload } from 'helper/upload_helper';
import path from 'path';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  presidentImageUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(presidentValidator),
  presidentController.create,
);
router.get('/', presidentController.getAll);
router.get(
  '/:id',
  validateSchema([checkValidId('id')]),
  presidentController.getById,
);

router.put(
  '/reorder',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(teamUpdateOrderValidator),
  presidentController.reorderItems,
);

router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  presidentImageUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema([checkValidId('id'), ...presidentUpdatetValidator]),
  presidentController.update,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['admin', 'superadmin']),
  validateSchema([checkValidId('id')]),
  presidentController.delete,
);

export default router;
