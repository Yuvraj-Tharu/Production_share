import { paginatedData } from '@utils/pagination';
import { BackgroundDocument, BackgroundModel } from '../model/background_mode';
import { create } from 'helper/service_helper';

class BackgroundServices {
  async createOrUpdate(data: BackgroundDocument): Promise<BackgroundDocument> {
    const result = await BackgroundModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return result;
  }

  async getBackground(): Promise<BackgroundDocument | null> {
    return await BackgroundModel.findOne({});
  }

  async delete(id: string): Promise<BackgroundDocument | null> {
    return await BackgroundModel.findByIdAndUpdate(id, {
      deleted: true,
      new: true,
    });
  }
}

export default new BackgroundServices();
