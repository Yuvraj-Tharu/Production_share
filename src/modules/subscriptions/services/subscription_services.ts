import SubscriptionModel, {
  SubscriptionDocument,
} from '../model/subscription_model';
import { paginatedData } from '@utils/pagination';

import { create, getById } from 'helper/service_helper';
class SubscriptionService {
  public async createSubscription(
    data: Partial<SubscriptionDocument>,
  ): Promise<SubscriptionDocument> {
    const { email } = data;
    const existing = await SubscriptionModel.findOne({ email, status: true });
    if (existing) {
      existing.status = false;
      return await existing.save();
    }
    const newSubscription = new SubscriptionModel({
      email,
      status: false,
    });

    return await newSubscription.save();
  }

  public async getSubscriptionById(
    id: string,
  ): Promise<SubscriptionDocument | null> {
    return await getById<SubscriptionDocument>(SubscriptionModel, id);
  }

  public async updateSubscription(
    id: string,
    data: Partial<SubscriptionDocument>,
  ): Promise<SubscriptionDocument | null> {
    return await SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteSubscription(
    id: string,
  ): Promise<SubscriptionDocument | null> {
    return await SubscriptionModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
  }

  public async getSubscription(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(SubscriptionModel, match, sort, page, perPage);
  }

  public async unsubscribe(
    status: Partial<SubscriptionDocument>,
  ): Promise<SubscriptionDocument | null> {
    return await SubscriptionModel.findOneAndUpdate(
      {
        email: status.email,
      },
      { status: true },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }
}

export default new SubscriptionService();
