import { Request, Response } from 'express';
import presidentService from '../services/president_services';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import { PresidentModel } from '../model/president_model';

class PresidentController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const latestPresident = await PresidentModel.aggregate([
        { $group: { _id: null, maxPosition: { $max: '$displayPosition' } } },
      ]);
      let displayPosition = 1;
      if (latestPresident.length > 0) {
        displayPosition = latestPresident[0].maxPosition + 1;
      }
      const president = await presidentService.create({
        ...req.body,
        displayPosition: displayPosition,
      });
      res
        .status(201)
        .json(success('President created successfully', 201, president));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to create President', error.message, 500));
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const president = await presidentService.getById(req.params.id);
      if (!president) {
        res.status(404).json(apiError('President not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('President retrieved successfully', 200, president));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to retrieve President', error.message, 500));
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const president = await presidentService.update(req.params.id, req.body);
      if (!president) {
        res.status(404).json(apiError('President not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('President updated successfully', 200, president));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update President', error.message, 500));
    }
  }

  public async reorderItems(req: Request, res: Response): Promise<void> {
    try {
      const updatedTeam = await presidentService.reorderItems(req.body);
      if (!updatedTeam) {
        res.status(404).json(apiError('Reorder failed not found', {}, 404));
        return;
      }
      res.status(200).json(success('President updated successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to reorder President', error as any, 500));
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const president = await presidentService.delete(req.params.id);
      if (!president) {
        res.status(404).json(apiError('President not found', {}, 404));
      }
      res.status(200).json(success('President deleted successfully', 200, {}));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete President', error.message, 500));
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      sortData.displayPosition = 1;
      delete sortData.createdAt;
      const { page = 1, perPage = 100 } = req.query;
      const Teams = await presidentService.getAll(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res
        .status(200)
        .json(success('Presidents fetched successfully', 200, Teams));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to fetch presidents', error.message, 500));
    }
  }
}

export default new PresidentController();
