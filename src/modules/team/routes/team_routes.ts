import express, { Request, Response, NextFunction } from 'express';
import TeamController from '../controller/team_controller';
import { validateSchema, checkValidId } from 'helper/validation_helper';
import {
  teamValidator,
  teamUpdatetValidator,
  teamUpdateOrderValidator,
} from '../validator/team_validator';
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
  validateSchema(teamUpdateOrderValidator),
  TeamController.createTeam,
);

router.get(
  '/:id',
  validateSchema([checkValidId('id')]),
  TeamController.getTeamById,
);

router.put(
  '/reorder',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(teamUpdateOrderValidator),
  TeamController.reorderItems,
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
  TeamController.updateTeam,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['admin', 'superadmin']),
  validateSchema([checkValidId('id')]),
  TeamController.deleteTeam,
);

router.get('/', TeamController.getTeams);

export default router;
