import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import BreadCrumService from '../services/breadcrumb_services';

class BreadCrumbController {
  public async createBreadCrumb(req: Request, res: Response): Promise<void> {
    try {
      const breadCrumb = await BreadCrumService.createBreadcrumb(req.body);
      res
        .status(201)
        .json(success('BreadCrumb created successfully', 201, breadCrumb));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to create BreadCrumb', error.message, 500));
    }
  }

  public async getBreadCrumb(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page, perPage } = req.query;
      const filter = req.query.filter;
      if (filter) {
        matchData.$or = [{ type: { $regex: filter, $options: 'i' } }];
      }
      const breadCrumb = await BreadCrumService.getBreadcrumb(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      if (!breadCrumb) {
        res.status(404).json(success('BreadCrumb not found', 404, {}));
      } else {
        res
          .status(200)
          .json(success('BreadCrumb retrieved successfully', 200, breadCrumb));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to retrieve BreadCrumb', error.message, 500));
    }
  }

  public async getBreadCrumbById(req: Request, res: Response): Promise<void> {
    try {
      const breadCrumb = await BreadCrumService.getBreadcrumbById(
        req.params.id,
      );
      if (!breadCrumb) {
        res.status(404).json(success('BreadCrumb not found', 404, {}));
      } else {
        res
          .status(200)
          .json(success('BreadCrumb retrieved successfully', 200, breadCrumb));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to retrieve BreadCrumb', error.message, 500));
    }
  }
  public async updateBreadCrumb(req: Request, res: Response): Promise<void> {
    try {
      const breadCrumb = await BreadCrumService.updateBreadcrumb(
        req.params.id,
        req.body,
      );
      if (!breadCrumb) {
        res.status(404).json(success('BreadCrumb not found', 404, {}));
      } else {
        res
          .status(200)
          .json(success('BreadCrumb updated successfully', 200, breadCrumb));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update BreadCrumb', error.message, 500));
    }
  }

  public async deleteBreadCrumb(req: Request, res: Response): Promise<void> {
    try {
      const breadCrumb = await BreadCrumService.deleteBreadcrumb(req.params.id);
      if (!breadCrumb) {
        res.status(404).json(success('BreadCrumb not found', 404, {}));
      } else {
        res
          .status(200)
          .json(success('BreadCrumb deleted successfully', 200, {}));
      }
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete BreadCrumb', error.message, 500));
    }
  }
}

export default new BreadCrumbController();
