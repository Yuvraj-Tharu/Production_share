import { Request, Response } from 'express';
import PrivacyService from '../services/privacy_service';
import { apiError, success } from '@utils/response';

class PrivacyController {
  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const terms = await PrivacyService.upsert(req.body);
      const statusCode = 200;
      res
        .status(statusCode)
        .json(success('Privacy terms updated successfully', statusCode, terms));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError("Couldn't update Privacy terms", { error }, 500));
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const terms = await PrivacyService.get();
      if (!terms) {
        res.status(404).json(apiError('Privacy not found', {}, 404));
        return;
      }
      res.status(200).json(success('Privacy fetched successfully', 200, terms));
    } catch (error: any) {
      res.status(500).json(apiError("Couldn't fetch Privacy", { error }, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const terms = await PrivacyService.delete(id);
      if (!terms) {
        res.status(404).json(apiError('Privacy not found', {}, 404));
        return;
      }
      res.status(200).json(success('Privacy deleted successfully', 200, terms));
    } catch (error: any) {
      res.status(500).json(apiError("Couldn't delete Privacy", { error }, 500));
    }
  }
}

export default new PrivacyController();
