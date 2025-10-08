import { Request, Response } from 'express';
import TeamService from '../services/team_service';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import Team from '../models/team_model';

class TeamController {
  async createTeam(req: Request, res: Response): Promise<void> {
    try {
      const latestTeamMember = await Team.aggregate([
        { $group: { _id: null, maxPosition: { $max: '$displayPosition' } } },
      ]);
      let displayPosition = 1;

      if (latestTeamMember.length > 0) {
        displayPosition = latestTeamMember[0].maxPosition + 1;
      }
      const team = await TeamService.createTeam({
        ...req.body,
        displayPosition: displayPosition,
      });
      res.status(201).json(success('Team created successfully', 201, team));
    } catch (error: any) {
      console.log(error);

      res
        .status(500)
        .json(apiError('Failed to create Team', error.stack as any, 500));
    }
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const team = await TeamService.getTeamById(req.params.id);
      if (!team) {
        res.status(404).json(apiError('Team not found', {}, 404));
        return;
      }
      res.status(200).json(success('Team retrieved successfully', 200, team));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve team', error as any, 500));
    }
  }

  async updateTeam(req: Request, res: Response): Promise<void> {
    try {
      const Team = await TeamService.updateTeam(req.params.id, req.body);
      if (!Team) {
        res.status(404).json(apiError('Team not found', {}, 404));
        return;
      }
      res.status(200).json(success('Team updated successfully', 200, Team));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to update team', error as any, 500));
    }
  }

  async reorderItems(req: Request, res: Response): Promise<void> {
    try {
      const updatedTeam = await TeamService.reorderItems(req.body);
      if (!updatedTeam) {
        res.status(404).json(apiError('Redorder failed not found', {}, 404));
        return;
      }
      res.status(200).json(success('Team updated successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to reorder team', error as any, 500));
    }
  }

  async deleteTeam(req: Request, res: Response): Promise<void> {
    try {
      const team = await TeamService.deleteTeam(req.params.id);
      if (!team) {
        res.status(404).json(apiError('Team not found', {}, 404));
        return;
      }
      res.status(200).json(success('Team deleted successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to delete Team', error as any, 500));
    }
  }

  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      sortData.displayPosition = 1;

      delete sortData.createdAt;
      const { page = 1, perPage = 100 } = req.query;
      const Teams = await TeamService.getTeams(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res.status(200).json(success('Teams retrieved successfully', 200, Teams));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve teams', error as any, 500));
    }
  }
}

export default new TeamController();
