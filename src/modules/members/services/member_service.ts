import { paginatedData } from '@utils/pagination';
import { CommitteMemberModel, IMember } from '../models/member_model';
import { create } from 'helper/service_helper';
class MemberService {
  async create(data: IMember) {
    return await create(CommitteMemberModel, data);
  }

  async getById(id: string) {
    return await CommitteMemberModel.findById(id);
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

    return await CommitteMemberModel.bulkWrite(bulkOperations);
  }

  async update(id: string, data: any) {
    return await CommitteMemberModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await CommitteMemberModel.findByIdAndUpdate(id, {
      deleted: true,
      new: true,
    });
  }

  public async getAll(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(CommitteMemberModel, match, sort, page, perPage);
  }
}

export default new MemberService();
