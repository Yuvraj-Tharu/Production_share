import { Request, Response } from 'express';
import BlogService from '../services/blog_services';
import { getMatchAndSortData } from '@utils/pagination';
import { apiError, success } from '@utils/response';

class BlogController {
  async getBlogs(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const search = req.query.search;
      if (search) {
        matchData.$or = [{ title: { $regex: search, $options: 'i' } }];
      }
      const { page = 1, perPage = 10 } = req.query;
      const blogs = await BlogService.getAllBlogs(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
        'author',
      );
      res.status(200).json(success('Blogs retrieved successfully', 200, blogs));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve blogs', error, 500));
    }
  }

  async getBlog(req: Request, res: Response): Promise<void> {
    try {
      const blog = await BlogService.getBlogBySlug(req.params.slug);
      if (blog) {
        res.status(200).json(success('Blog retrieved successfully', 200, blog));
      } else {
        res.status(404).json(apiError('Blog not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve the blog', error, 500));
    }
  }

  async createNewBlog(req: Request, res: Response): Promise<void> {
    try {
      const author = req.user?.id;
      const newblog = {
        author,
        ...req.body,
      };
      const newBlog = await BlogService.createBlog(newblog);
      res.status(201).json(success('Blog created successfully', 201, newBlog));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to create the blog', error.stack, 500));
    }
  }

  async updateExistingBlog(req: Request, res: Response): Promise<void> {
    try {
      const updatedBlog = await BlogService.updateBlog(req.params.id, req.body);
      if (updatedBlog) {
        res
          .status(200)
          .json(success('Blog updated successfully', 200, updatedBlog));
      } else {
        res.status(404).json(apiError('Blog not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to update the blog', error, 500));
    }
  }

  async deleteBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const deletedBlog = await BlogService.deleteBlog(req.params.id);
      if (deletedBlog) {
        res.status(200).json(success('Blog deleted successfully', 200, {}));
      } else {
        res.status(404).json(apiError('Blog not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to delete the blog', error, 500));
    }
  }

  async favoriteBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const blog = await BlogService.favoriteBlog(req.params.slug);
      if (blog) {
        res.status(200).json(success('Blog favorited successfully', 200, blog));
      } else {
        res.status(404).json(apiError('Blog not found', {}, 404));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to favorite the blog', error, 500));
    }
  }

  async addBlogComment(req: Request, res: Response): Promise<void> {
    try {
      const blog = await BlogService.addComment(req.params.slug, req.body);
      if (blog) {
        res.status(200).json(success('Comment added successfully', 200, blog));
      } else {
        res.status(404).json(apiError('Blog not found', {}, 404));
      }
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to add comment', error, 500));
    }
  }

  async getTrendingBlogs(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;

      const blogs = await BlogService.getTrendingBlogs(
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

  async getLatestBlogs(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;

      const blogs = await BlogService.getLatestBlogs(
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

export default new BlogController();
