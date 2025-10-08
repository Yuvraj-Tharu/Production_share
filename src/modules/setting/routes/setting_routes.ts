import express, { Request, Response, NextFunction } from 'express';
import SettingController from '../controller/setting_controller';
import { settingValidation } from '../validator/setting_validator';
import { validateSchema } from 'helper/validation_helper';
import { CustomFile, settingServiceMultiple } from 'helper/upload_helper';
import { authenticateToken, checkRole } from '@middleware/auth';
import path from 'path';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  settingServiceMultiple,
  (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['headerLogo[url]'] && files['headerLogo[url]'].length > 0) {
      const filename = path.basename(files['headerLogo[url]'][0].path);
      req.body.headerLogo = req.body.headerLogo || {};
      req.body.headerLogo.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    if (files['footerLogo[url]'] && files['footerLogo[url]'].length > 0) {
      const filename = path.basename(files['footerLogo[url]'][0].path);
      req.body.footerLogo = req.body.footerLogo || {};
      req.body.footerLogo.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(settingValidation),
  SettingController.createOrUpdate,
);

router.get('/', SettingController.get);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  SettingController.delete,
)

export default router;
