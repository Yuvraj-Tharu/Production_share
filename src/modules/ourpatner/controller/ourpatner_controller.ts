import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import PatnerServices from '../services/ourpatner_services';
import { getMatchAndSortData } from '@utils/pagination';
class PatnerController {
  static async getAllBrand(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const brand = await PatnerServices.getAllBrand(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      if (!brand) {
        res.status(404).json(apiError('Our Patner not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Our Patner fetched successfully', 200, brand));
    } catch (error: any) {
      res.status(500).json(apiError('Failed to fetch brand', {}, 500));
    }
  }

  static async createBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await PatnerServices.createBrand(req.body);
      if (!brand) {
        res.status(400).json(apiError('Failed to create brand', {}, 400));
        return;
      }
      res
        .status(201)
        .json(success('Our Patner created successfully', 201, brand));
    } catch (error: any) {
      res.status(500).json(apiError('Failed to create brand', {}, 500));
    }
  }

  static async getBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await PatnerServices.getBrandById(req.params.id);
      if (!brand) {
        res.status(404).json(apiError('Our Patner not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Our Patner fetched successfully', 200, brand));
    } catch (error: any) {
      res.status(500).json(apiError('Failed to fetch brand', {}, 500));
    }
  }

  static async deleteBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await PatnerServices.deleteBrand(req.params.id);
      if (!brand) {
        res.status(404).json(apiError('Our Patner not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Our Patner deleted successfully', 200, brand));
    } catch (error: any) {
      res.status(500).json(apiError('Failed to delete brand', {}, 500));
    }
  }

  static async updateBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await PatnerServices.updateBrand(req.params.id, req.body);

      if (!brand) {
        res.status(404).json(apiError('Our Patner not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Our Patner updated successfully', 200, brand));
    } catch (error: any) {
      res.status(500).json(apiError('Failed to update brand', {}, 500));
    }
  }
}

export default PatnerController;
