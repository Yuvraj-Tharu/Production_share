import { Home, HomeDocument } from '../model/home_model';
class HomeService {
  static async createOrUpdate(
    data: Partial<HomeDocument>,
  ): Promise<HomeDocument> {
    const setting = await Home.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return setting;
  }

  static async get(): Promise<HomeDocument | null> {
    return await Home.findOne({}).populate('missionVision');
  }
}

export default HomeService;
