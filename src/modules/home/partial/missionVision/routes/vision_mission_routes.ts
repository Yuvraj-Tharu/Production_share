import express, { Response, Request, NextFunction } from 'express';
import VisionMissionController from '../controller/vision_mission_controller';
import { validateSchema } from 'helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import { CustomFile, missionVisionImageUpload } from 'helper/upload_helper';
import { validateVisionMission } from '../validator/vision_mission_validator';
import path from 'path';
const router = express.Router();

router
  .route('/')
  .get(VisionMissionController.get)
  .post(
    authenticateToken,
    checkRole(['superadmin']),
    missionVisionImageUpload,
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
    validateSchema(validateVisionMission),
    VisionMissionController.createOrUpdate,
  );

router
  .route('/:id')
  .delete(
    authenticateToken,
    checkRole(['superadmin']),
    VisionMissionController.delete,
  );

export default router;
