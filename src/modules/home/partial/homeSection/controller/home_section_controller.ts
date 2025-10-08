import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import HomeSectionService from '../services/home_section_services';

class HomeSectionController {
  public async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const statement = await HomeSectionService.createStatement(req.body);
      res
        .status(201)
        .json(success(' created/update successfully', 201, statement));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to create home section', error, 500));
    }
  }

  public async get(req: Request, res: Response): Promise<void> {
    try {
      const statement = await HomeSectionService.getStatementById();
      if (statement) {
        res
          .status(200)
          .json(success('home section retrieved successfully', 200, statement));
        return;
      } else {
        res.status(404).json(await apiError('home section not found', {}, 404));
        return;
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve home section', error, 500));
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const statement = await HomeSectionService.deleteStatement(req.params.id);
      if (statement) {
        res
          .status(200)
          .json(success('home section deleted successfully', 200, statement));
        return;
      } else {
        res.status(404).json(await apiError('home section not found', {}, 404));
        return;
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to delete home section', error, 500));
    }
  }
}

export default new HomeSectionController();
