import VisionMissionModel, {
  VisionMissionDocuments,
} from '../model/vision_mission_model';


class VisionMissionService {
  public async createStatement(
    data: VisionMissionDocuments,
  ): Promise<VisionMissionDocuments> {
    const mission = await VisionMissionModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return mission;
  }

  public async getStatementById(): Promise<VisionMissionDocuments | null> {
    return await VisionMissionModel.findOne({});
  }

  public async updateStatement(
    id: string,
    data: Partial<VisionMissionDocuments>,
  ): Promise<VisionMissionDocuments | null> {
    return await VisionMissionModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
  }

  public async deleteStatement(
    id: string,
  ): Promise<VisionMissionDocuments | null> {
    return await VisionMissionModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    ).exec();
  }
}

export default new VisionMissionService();
