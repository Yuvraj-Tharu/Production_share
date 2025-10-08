import { Request, Response } from 'express';
import backgroundServices from '../services/background_services';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';

class BackgroundController {
  async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const background = await backgroundServices.createOrUpdate(req.body);
      res
        .status(201)
        .json(
          success('Background created/updated successfully', 201, background),
        );
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update background', error.stack as any, 500));
    }
  }

  async getBackground(req: Request, res: Response): Promise<void> {
    try {
      const background = await backgroundServices.getBackground();
      if (!background) {
        res.status(204).json(apiError('no containent found', {}, 204));
        return;
      }
      res
        .status(200)
        .json(success('Background retrieved successfully', 200, background));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve background', error as any, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const background = await backgroundServices.delete(req.params.id);
      if (!background) {
        res.status(404).json(apiError('Background not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Background deleted successfully', 200, background));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete background', error.stack as any, 500));
    }
  }
}

export default new BackgroundController();
