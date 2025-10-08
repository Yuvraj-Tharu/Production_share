import { Request, Response } from 'express';
import { success, apiError } from '@utils/response';
import SubscriptionService from '../services/subscription_services';
import { getMatchAndSortData } from '@utils/pagination';

class SubscriptionController {
  public async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscription = await SubscriptionService.createSubscription(
        req.body,
      );
      if (!subscription) {
        res
          .status(400)
          .json(apiError('Failed to create Subscription', {}, 400));
        return;
      }

      res
        .status(201)
        .json(success('Subscription created successfully', 201, subscription));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to create Subscription', error.message, 500));
    }
  }

  public async getSubscriptionById(req: Request, res: Response): Promise<void> {
    try {
      const subscription = await SubscriptionService.getSubscriptionById(
        req.params.id,
      );
      if (!subscription) {
        res.status(404).json(apiError('Subscription not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(
          success('Subscription retrieved successfully', 200, subscription),
        );
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to retrieve Subscription', error.message, 500));
    }
  }

  public async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscription = await SubscriptionService.updateSubscription(
        req.params.id,
        req.body,
      );
      if (!subscription) {
        res.status(404).json(apiError('Subscription not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Subscription updated successfully', 200, subscription));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to update Subscription', error.message, 500));
    }
  }
  public async deleteSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscription = await SubscriptionService.deleteSubscription(
        req.params.id,
      );
      if (!subscription) {
        res.status(404).json(apiError('Subscription not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Subscription deleted successfully', 200, {}));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to delete Subscription', error.message, 500));
    }
  }

  public async getSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const subscription = await SubscriptionService.getSubscription(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );

      if (!subscription) {
        res.status(404).json(apiError('Subscription not found', {}, 404));
        return;
      }

      res
        .status(200)
        .json(success('Subscription fetched successfully', 200, subscription));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to retrieve Subscription', error.message, 500));
    }
  }
  public async unsubscribe(req: Request, res: Response): Promise<void> {
    try {
      const subscription = await SubscriptionService.unsubscribe(req.body);
      if (!subscription) {
        res.status(404).json(apiError('Subscription not found', {}, 404));
        return;
      }
      res
        .status(200)
        .json(success('Unsubscribed successfully', 200, subscription));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to unsubscribe', error.message, 500));
    }
  }
}

export default new SubscriptionController();
