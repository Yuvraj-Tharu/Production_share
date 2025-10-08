import Privacy, { IPrivacy } from '../models/privacy_model';

class PrivacyService {
  async upsert(data: IPrivacy): Promise<IPrivacy> {
    const existingPrivacy = await Privacy.findOne();

    if (existingPrivacy) {
      return (await Privacy.findByIdAndUpdate(
        existingPrivacy._id,
        { $set: data },
        { new: true },
      )) as IPrivacy;
    }

    return await Privacy.create(data);
  }
  async get(): Promise<IPrivacy | null> {
    return await Privacy.findOne();
  }

  async delete(id: string): Promise<IPrivacy | null> {
    return await Privacy.findByIdAndDelete(id);
  }
}

export default new PrivacyService();
