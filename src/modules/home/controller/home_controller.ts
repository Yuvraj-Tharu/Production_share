import { Request, Response } from 'express';
import { apiError, success } from '@utils/response';
import HomeService from '../services/home_services';

class HomeController {
  static async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const home = await HomeService.createOrUpdate(req.body);
      res
        .status(201)
        .json(success('Home created/updated successfully', 201, home));
    } catch (error: any) {
      console.log(error.message);

      res
        .status(500)
        .json(apiError('Failed to create/update home', error.message, 500));
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const home = await HomeService.get();

      if (!home) {
        res.status(404).json(apiError('Home not found', {}, 404));
        return;
      }

      res.status(200).json(success('Home fetched successfully', 200, home));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(apiError('Failed to fetch home', error, 500));
    }
  }
}

export default HomeController;
