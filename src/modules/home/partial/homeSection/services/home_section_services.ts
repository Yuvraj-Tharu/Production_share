import {
  HomeSectionDocuments,
  HomeSectionModel,
} from '../model/home_section_model';

class HomeSectionService {
  public async createStatement(
    data: HomeSectionDocuments,
  ): Promise<HomeSectionDocuments> {
    const mission = await HomeSectionModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return mission;
  }

  public async getStatementById(): Promise<HomeSectionDocuments | null> {
    return await HomeSectionModel.findOne({});
  }

  public async updateStatement(
    id: string,
    data: Partial<HomeSectionDocuments>,
  ): Promise<HomeSectionDocuments | null> {
    return await HomeSectionModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
  }

  public async deleteStatement(
    id: string,
  ): Promise<HomeSectionDocuments | null> {
    return await HomeSectionModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    ).exec();
  }
}

export default new HomeSectionService();
