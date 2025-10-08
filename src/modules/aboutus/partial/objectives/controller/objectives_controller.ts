import { Request, Response } from 'express';
import objectivesServices from '../services/objectives_services';
import { success, apiError } from '@utils/response';

class ObjectivesController {
  async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const background = await objectivesServices.createOrUpdate(req.body);
      res
        .status(201)
        .json(
          success('Objectives created/updated successfully', 201, background),
        );
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update Objectives', error.stack as any, 500));
    }
  }

  async getBackground(req: Request, res: Response): Promise<void> {
    try {
      const background = await objectivesServices.getBackground();
      if (!background) {
        res.status(204).json(apiError('no containent found', {}, 204));
        return;
      }
      res
        .status(200)
        .json(success('Objectives retrieved successfully', 200, background));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve Objectives', error as any, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const background = await objectivesServices.delete(req.params.id);
      if (!background) {
        res.status(404).json(apiError('Objectives not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Objectives deleted successfully', 200, background));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete Objectives', error.stack as any, 500));
    }
  }
}

export default new ObjectivesController();
