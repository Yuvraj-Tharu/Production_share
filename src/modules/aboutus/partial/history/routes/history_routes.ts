import express, { Request, Response, NextFunction } from 'express';
import historyController from '../controller/history_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import {
  historyUpdateOrderValidator,
  historyUpdateValidator,
  historyValidator,
} from '../validator/history_validator';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, teamImageUpload } from 'helper/upload_helper';
import path from 'path';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  teamImageUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(historyValidator),
  historyController.create,
);

router.get('/', historyController.getAll);

router.get(
  '/:id',
  validateSchema([checkValidId('id')]),
  historyController.getById,
);

router.put(
  '/reorder',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(historyUpdateOrderValidator),
  historyController.reorderItems,
);

router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  teamImageUpload,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema([checkValidId('id'), ...historyUpdateValidator]),
  historyController.update,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['admin', 'superadmin']),
  validateSchema([checkValidId('id')]),
  historyController.delete,
);

export default router;
