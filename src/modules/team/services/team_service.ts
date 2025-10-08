import { paginatedData } from '@utils/pagination';
import Team, { ITeam } from '../models/team_model';
import { create } from 'helper/service_helper';
class TeamService {
  async createTeam(data: ITeam) {
    return await create(Team, data);
  }

  async getTeamById(id: string) {
    return await Team.findById(id);
  }

  async reorderItems(updatedItems: { id: string; displayPosition: number }[]) {
    const bulkOperations = updatedItems.map(
      (item: { id: string; displayPosition: number }) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { displayPosition: item.displayPosition } },
        },
      }),
    );

    return await Team.bulkWrite(bulkOperations);
  }

  async updateTeam(id: string, data: any) {
    return await Team.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTeam(id: string) {
    return await Team.findByIdAndUpdate(id, { deleted: true, new: true });
  }

  public async getTeams(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(Team, match, sort, page, perPage);
  }
}

export default new TeamService();
