import { Request, Response } from 'express';
import SettingService from '../services/setting_service';
import { apiError, success } from '@utils/response';

class SettingController {
  static async createOrUpdate(req: Request, res: Response): Promise<void> {
    try {
      const setting = await SettingService.createOrUpdate(req.body);
      res
        .status(201)
        .json(success('Setting created/updated successfully', 201, setting));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to create/update setting', error, 500));
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const setting = await SettingService.get();
      if (!setting) {
        res.status(404).json(apiError('Setting not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Setting fetched successfully', 200, setting));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(apiError('Failed to fetch setting', error, 500));
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await SettingService.delete(id);
      if (result) {
        res.status(200).json(success('Setting deleted successfully', 200, {}));
      } else {
        res.status(404).json(apiError('Setting not found', {}, 404));
      }
    } catch (error: any) {
      res.status(500).json(apiError('Failed to delete setting', error, 500));
    }
  }
}

export default SettingController;
