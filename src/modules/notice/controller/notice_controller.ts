import { Request, Response } from 'express';
import noticeService from '../services/notice_services';
import { getMatchAndSortData } from '@utils/pagination';
import { apiError, success } from '@utils/response';

class NoticeController {
  async getAllNotice(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const search = req.query.search;
      if (search) {
        matchData.$or = [{ title: { $regex: search, $options: 'i' } }];
      }
      const { page = 1, perPage = 10 } = req.query;
      const blogs = await noticeService.getAllNotice(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
        'author',
      );
      res
        .status(200)
        .json(success('Notice retrieved successfully', 200, blogs));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve Notice', error, 500));
    }
  }

  async getNotice(req: Request, res: Response): Promise<void> {
    try {
      const notice = await noticeService.getNoticeBySlug(req.params.slug);
      if (notice) {
        res
          .status(200)
          .json(success('Notice retrieved successfully', 200, notice));
      } else {
        res.status(404).json(apiError('Notice not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve the notice', error, 500));
    }
  }

  async createNewNotice(req: Request, res: Response): Promise<void> {
    try {
      const author = req.user?.id;
      const newblog = {
        author,
        ...req.body,
      };
      const newBlog = await noticeService.createNotice(newblog);
      res
        .status(201)
        .json(success('Notice created successfully', 201, newBlog));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to create the notice', error.stack, 500));
    }
  }

  async updateExistingNotice(req: Request, res: Response): Promise<void> {
    try {
      const updatedBlog = await noticeService.updateNotice(
        req.params.id,
        req.body,
      );
      if (updatedBlog) {
        res
          .status(200)
          .json(success('Notice updated successfully', 200, updatedBlog));
      } else {
        res.status(404).json(apiError('Notice not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to update the notice', error, 500));
    }
  }

  async deleteNoticePost(req: Request, res: Response): Promise<void> {
    try {
      const deletedBlog = await noticeService.deleteNotice(req.params.id);
      if (deletedBlog) {
        res.status(200).json(success('Notice deleted successfully', 200, {}));
      } else {
        res.status(404).json(apiError('Notice not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to delete the notice', error, 500));
    }
  }

  async favoriteNoticePost(req: Request, res: Response): Promise<void> {
    try {
      const notice = await noticeService.favoriteNotice(req.params.slug);
      if (notice) {
        res
          .status(200)
          .json(success('Notice favorited successfully', 200, notice));
      } else {
        res.status(404).json(apiError('Notice not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to favorite the notice', error, 500));
    }
  }

  async addNoticeComment(req: Request, res: Response): Promise<void> {
    try {
      const notice = await noticeService.addComment(req.params.slug, req.body);
      if (notice) {
        res
          .status(200)
          .json(success('Comment added successfully', 200, notice));
      } else {
        res.status(404).json(apiError('Notice not found', {}, 404));
      }
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to add comment', error, 500));
    }
  }

  async getTrendingNotice(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;

      const blogs = await noticeService.getTrendingNotice(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
        'author',
      );

      res
        .status(200)
        .json(success('Trending blogs retrieved successfully', 200, blogs));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve trending blogs', error, 500));
    }
  }

  async getLatestNotice(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;

      const blogs = await noticeService.getLatestNotice(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
        'author',
      );

      res
        .status(200)
        .json(success('Latest blogs retrieved successfully', 200, blogs));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve latest blogs', error, 500));
    }
  }
}

export default new NoticeController();
