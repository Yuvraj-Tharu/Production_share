import { Request, Response } from 'express';
import AboutUsService from '../services/about_us_services';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
class AboutUsController {
  async createAboutUs(req: Request, res: Response): Promise<void> {
    try {
      const aboutUs = await AboutUsService.createAboutUs(req.body);
      res
        .status(201)
        .json(success('About Us created successfully', 201, aboutUs));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to create About Us', error as any, 500));
    }
  }

  async getAboutUs(req: Request, res: Response): Promise<void> {
    try {
      const aboutUs = await AboutUsService.getAboutUs();
      if (!aboutUs) {
        res.status(404).json(success('About Us not found', 404, {}));
      } else {
        res
          .status(200)
          .json(success('About Us retrieved successfully', 200, aboutUs));
      }
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve About Us', error as any, 500));
    }
  }
}

export default new AboutUsController();
