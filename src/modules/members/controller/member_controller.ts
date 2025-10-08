import { Request, Response } from 'express';
import memberService from '../services/member_service';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import { CommitteMemberModel } from '../models/member_model';

class MemberController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const latestTeamMember = await CommitteMemberModel.aggregate([
        { $group: { _id: null, maxPosition: { $max: '$displayPosition' } } },
      ]);
      let displayPosition = 1;

      if (latestTeamMember.length > 0) {
        displayPosition = latestTeamMember[0].maxPosition + 1;
      }
      const team = await memberService.create({
        ...req.body,
        displayPosition: displayPosition,
      });
      res.status(201).json(success('Member created successfully', 201, team));
    } catch (error: any) {
      console.log(error);

      res
        .status(500)
        .json(apiError('Failed to create Member', error.stack as any, 500));
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const team = await memberService.getById(req.params.id);
      if (!team) {
        res.status(404).json(apiError('Member not found', {}, 404));
        return;
      }
      res.status(200).json(success('Member retrieved successfully', 200, team));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve Member', error as any, 500));
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const Team = await memberService.update(req.params.id, req.body);
      if (!Team) {
        res.status(404).json(apiError('Member not found', {}, 404));
        return;
      }
      res.status(200).json(success('Member updated successfully', 200, Team));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to update Member', error as any, 500));
    }
  }

  async reorderItems(req: Request, res: Response): Promise<void> {
    try {
      const updatedTeam = await memberService.reorderItems(req.body);
      if (!updatedTeam) {
        res.status(404).json(apiError('Redorder failed not found', {}, 404));
        return;
      }
      res.status(200).json(success('Member updated successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to reorder Member', error as any, 500));
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const team = await memberService.delete(req.params.id);
      if (!team) {
        res.status(404).json(apiError('Member not found', {}, 404));
        return;
      }
      res.status(200).json(success('Member deleted successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to delete Member', error as any, 500));
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      sortData.displayPosition = 1;
      delete sortData.createdAt;
      const { page = 1, perPage = 100 } = req.query;
      const Teams = await memberService.getAll(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res
        .status(200)
        .json(success('Member retrieved successfully', 200, Teams));
    } catch (error) {
      res
        .status(500)
        .json(apiError('Failed to retrieve Member', error as any, 500));
    }
  }
}

export default new MemberController();
