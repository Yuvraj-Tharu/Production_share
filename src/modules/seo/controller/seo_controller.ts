import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import SeoService from '../services/seo_services';
import { getMatchAndSortData } from '@utils/pagination';

class SeoController {
  public async getAllSeo(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const seo = await SeoService.getAllSeo(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      if (!seo) {
        res.status(404).json(await apiError('SEO not found', {}, 404));
        return;
      }
      res.status(200).json(success('SEO fetched successfully', 200, seo));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to fetch SEO', {}, 500));
    }
  }

  public async createSeo(req: Request, res: Response): Promise<void> {
    try {
      const seo = await SeoService.createSeo(req.body);
      if (!seo) {
        res.status(400).json(await apiError('Failed to create SEO', {}, 400));
        return;
      }
      res.status(201).json(success('SEO created successfully', 201, seo));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to create SEO',error.message, 500));
    }
  }

  public async getSeoById(req: Request, res: Response): Promise<void> {
    try {
      const seo = await SeoService.getSeoById(req.params.id);
      if (!seo) {
        res.status(404).json(await apiError('SEO not found', {}, 404));
        return;
      }
      res.status(200).json(success('SEO fetched successfully', 200, seo));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to fetch SEO', {}, 500));
    }
  }

  public async getSeoBySeoFor(req: Request, res: Response): Promise<void> {
    try {
      const seo = await SeoService.getSeoBySeoFor(req.params.type);
      if (!seo) {
        res.status(404).json(await apiError('SEO not found', {}, 404));
        return;
      }
      res.status(200).json(success('SEO fetched successfully', 200, seo));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to fetch SEO', {}, 500));
    }
  }

  public async updateSeo(req: Request, res: Response): Promise<void> {
    try {
      const seo = await SeoService.updateSeo(req.params.id, req.body);
      if (!seo) {
        res.status(404).json(await apiError('SEO not found', {}, 404));
        return;
      }
      res.status(200).json(success('SEO updated successfully', 200, seo));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to update SEO', {}, 500));
    }
  }

  public async deleteSeo(req: Request, res: Response): Promise<void> {
    try {
      const seo = await SeoService.deleteSeo(req.params.id);
      if (!seo) {
        res.status(404).json(await apiError('SEO not found', {}, 404));
        return;
      }
      res.status(200).json(success('SEO deleted successfully', 200, {}));
    } catch (error: any) {
      res.status(500).json(await apiError('Failed to delete SEO', {}, 500));
    }
  }
}

export default new SeoController();
