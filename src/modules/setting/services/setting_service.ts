import Setting, { ISetting } from '../model/setting_model';

class SettingService {
  static async createOrUpdate(data: Partial<ISetting>): Promise<ISetting> {
    const setting = await Setting.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return setting;
  }
  static async get(): Promise<ISetting | null> {
    return await Setting.findOne({});
  }

  static async delete(id: string): Promise<ISetting | null> {
    return await Setting.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
  }
}

export default SettingService;
