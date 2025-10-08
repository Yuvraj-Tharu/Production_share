import { Request, Response } from 'express';
import TermsService from '../services/terms_service';
import { apiError, success } from '@utils/response';

class TermsController {
  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const terms = await TermsService.upsert(req.body);
      const statusCode = 200;
      res
        .status(statusCode)
        .json(success('Terms updated successfully', statusCode, terms));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError("Couldn't update Privacy terms", { error }, 500));
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const terms = await TermsService.get();
      if (!terms) {
        res
          .status(404)
          .json(apiError('Terms and conditions not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Terms and conditions fetched successfully', 200, terms));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError("Couldn't fetch terms and conditions", { error }, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const terms = await TermsService.delete(id);
      if (!terms) {
        res
          .status(404)
          .json(apiError('Terms and conditions not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Terms and conditions deleted successfully', 200, terms));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError("Couldn't delete terms and conditions", { error }, 500));
    }
  }
}

export default new TermsController();
