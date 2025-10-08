import express, { Request, Response, NextFunction } from 'express';
import NoticeController from '../controller/notice_controller';
import { authenticateToken, checkRole } from '@middleware/auth';
import { blogImageFile, CustomFile } from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';

import {
  blogCommentValidator,
  blogUpdateValidationRules,
  blogValidationRules,
} from '../validator/notice_validator';
import path from 'path';

const router = express.Router();

router.get('/', NoticeController.getAllNotice);
router.get('/trending', NoticeController.getTrendingNotice);
router.get('/latest', NoticeController.getLatestNotice);
router.get('/:slug', NoticeController.getNotice);
router.post(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  blogImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }

    next();
  },
  validateSchema(blogValidationRules),
  NoticeController.createNewNotice,
);
router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  blogImageFile,
  (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as { [fieldname: string]: CustomFile[] };
    if (files['image[url]'] && files['image[url]'].length > 0) {
      const filename = path.basename(files['image[url]'][0].path);
      req.body.image = req.body.image || {};
      req.body.image.url = `${process.env.IMAGE_URL}/images/${filename}`;
    }
    next();
  },
  validateSchema(blogUpdateValidationRules),
  NoticeController.updateExistingNotice,
);
router.delete('/:id', NoticeController.deleteNoticePost);
router.post('/:slug/favorite', NoticeController.favoriteNoticePost);
router.post(
  '/:slug/comment',
  validateSchema(blogCommentValidator),
  NoticeController.addNoticeComment,
);

export default router;
