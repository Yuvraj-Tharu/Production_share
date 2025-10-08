import { Request, Response } from 'express';
import FaqService from '../services/faq_services';
import { apiError, success } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
class FaqsController {
  public async getFaqs(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const faqs = await FaqService.getFaqs(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res.status(200).json(success('Faqs retrieved successfully', 200, faqs));
    } catch (error) {
      res.status(500).json(await apiError('Failed to fetch faqs', {}, 500));
    }
  }

  public async createNewFaq(req: Request, res: Response): Promise<void> {
    try {
      const faq = await FaqService.createFaq(req.body);
      res.status(201).json(success('Faq created successfully', 201, faq));
    } catch (error) {
      res.status(500).json(await apiError('Failed to create faq', {}, 500));
    }
  }

  public async updateFaq(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await FaqService.updateFaq(id, req.body);
      if (!faq) {
        res.status(404).json(await apiError('FAQ not found', {}, 404));
        return;
      }

      res.status(200).json(success('Faq updated successfully', 200, faq));
    } catch (error) {
      res.status(500).json(await apiError('Failed to update faq', {}, 500));
    }
  }

  public async deleteFaq(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await FaqService.deleteFaq(id);
      if (!faq) {
        res.status(404).json(await apiError('FAQ not found', {}, 404));
        return;
      }

      res.status(200).json(success('Faq deleted successfully', 200, {}));
    } catch (error) {
      res.status(500).json(await apiError('Failed to delete faq', {}, 500));
    }
  }

  public async getFaqById(req: Request, res: Response): Promise<void> {
    try {
      const faq = await FaqService.getFaqById(req.params.id);
      if (!faq) {
        res.status(404).json(await apiError('FAQ not found', {}, 404));
        return;
      }

      res.status(200).json(success('Faq retrieved successfully', 200, faq));
    } catch (error) {
      res.status(500).json(await apiError('Failed to get faq', {}, 500));
    }
  }
}

export default new FaqsController();
