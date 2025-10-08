import { ObjectivesDocument, ObjectivesModel } from '../model/objectives_model';

class ObjectivesServices {
  async createOrUpdate(data: ObjectivesDocument): Promise<ObjectivesDocument> {
    const result = await ObjectivesModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return result;
  }

  async getBackground(): Promise<ObjectivesDocument | null> {
    return await ObjectivesModel.findOne({});
  }

  async delete(id: string): Promise<ObjectivesDocument | null> {
    return await ObjectivesModel.findByIdAndUpdate(id, {
      deleted: true,
      new: true,
    });
  }
}

export default new ObjectivesServices();
