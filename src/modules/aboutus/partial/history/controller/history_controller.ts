import { Request, Response } from 'express';
import historyServices from '../services/history_services';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import { HistoryModel } from '../model/history_model';

class HistoryController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const latestHistory = await HistoryModel.aggregate([
        { $group: { _id: null, maxPosition: { $max: '$displayPosition' } } },
      ]);
      let displayPosition = 1;
      if (latestHistory.length > 0) {
        displayPosition = latestHistory[0].maxPosition + 1;
      }
      const history = await historyServices.create({
        ...req.body,
        displayPosition: displayPosition,
      });
      res
        .status(201)
        .json(success('History created successfully', 201, history));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to create history', error.stack as any, 500));
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const history = await historyServices.getById(req.params.id);
      if (!history) {
        res.status(404).json(apiError('History not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('History retrieved successfully', 200, history));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve history', error as any, 500));
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const history = await historyServices.update(req.params.id, req.body);
      if (!history) {
        res.status(404).json(apiError('History not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('History updated successfully', 200, history));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update history', error.stack as any, 500));
    }
  }
  async reorderItems(req: Request, res: Response): Promise<void> {
    try {
      const updatedTeam = await historyServices.reorderItems(req.body);
      if (!updatedTeam) {
        res.status(404).json(apiError('Redorder failed not found', {}, 404));
        return;
      }
      res.status(200).json(success('History updated successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to reorder history', error as any, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const history = await historyServices.delete(req.params.id);
      if (!history) {
        res.status(404).json(apiError('History not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('History deleted successfully', 200, history));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete history', error.stack as any, 500));
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      sortData.displayPosition = 1;
      delete sortData.createdAt;
      const { page = 1, perPage = 100 } = req.query;
      const Teams = await historyServices.getAll(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res
        .status(200)
        .json(success('History retrieved successfully', 200, Teams));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve teams', error as any, 500));
    }
  }
}

export default new HistoryController();
