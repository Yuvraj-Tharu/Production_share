import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import StatementService from '../services/vision_mission_services';
class VisionMissionController {
  public async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const statement = await StatementService.createStatement(req.body);
      res
        .status(201)
        .json(success(' created/update successfully', 201, statement));
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to create vison/mission', error, 500));
    }
  }

  public async get(req: Request, res: Response): Promise<void> {
    try {
      const statement = await StatementService.getStatementById();
      if (statement) {
        res
          .status(200)
          .json(
            success('vison/mission retrieved successfully', 200, statement),
          );
        return;
      } else {
        res
          .status(404)
          .json(await apiError('vison/mission not found', {}, 404));
        return;
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve vison/mission', error, 500));
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const statement = await StatementService.deleteStatement(req.params.id);
      if (statement) {
        res
          .status(200)
          .json(success('vison/mission deleted successfully', 200, statement));
        return;
      } else {
        res
          .status(404)
          .json(await apiError('vison/mission not found', {}, 404));
        return;
      }
    } catch (error: any) {
      res
        .status(500)
        .json(await apiError('Failed to delete vison/mission', error, 500));
    }
  }
}

export default new VisionMissionController();
