import express, { Request, Response, NextFunction } from 'express';
import BlogController from '../controller/blog_controller';
import { authenticateToken, checkRole } from '@middleware/auth';
import { blogImageFile, CustomFile } from 'helper/upload_helper';
import { validateSchema } from 'helper/validation_helper';

import {
  blogCommentValidator,
  blogUpdateValidationRules,
  blogValidationRules,
} from '../validator/blog_validator';
import path from 'path';

const router = express.Router();

router.get('/', BlogController.getBlogs);
router.get('/trending', BlogController.getTrendingBlogs);
router.get('/latest', BlogController.getLatestBlogs);
router.get('/:slug', BlogController.getBlog);
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
  BlogController.createNewBlog,
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
  BlogController.updateExistingBlog,
);
router.delete('/:id', BlogController.deleteBlogPost);
router.post('/:slug/favorite', BlogController.favoriteBlogPost);
router.post(
  '/:slug/comment',
  validateSchema(blogCommentValidator),
  BlogController.addBlogComment,
);

export default router;
