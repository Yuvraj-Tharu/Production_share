import express, { Request, Response, NextFunction } from 'express';
import memberController from '../controller/member_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import {
  teamUpdatetValidator,
  teamUpdateOrderValidator,
  teamCreateValidator,
} from '../validator/memeber_validator';
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
  validateSchema(teamCreateValidator),
  memberController.create,
);
router.get('/', memberController.getAll);
router.get(
  '/:id',
  validateSchema([checkValidId('id')]),
  memberController.getById,
);

router.put(
  '/reorder',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(teamUpdateOrderValidator),
  memberController.reorderItems,
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
  validateSchema([checkValidId('id'), ...teamUpdatetValidator]),
  memberController.update,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['admin', 'superadmin']),
  validateSchema([checkValidId('id')]),
  memberController.delete,
);

export default router;
