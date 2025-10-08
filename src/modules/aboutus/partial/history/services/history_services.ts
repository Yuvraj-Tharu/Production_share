import { paginatedData } from '@utils/pagination';
import { HistoryDoc, HistoryModel } from '../model/history_model';
import { create } from 'helper/service_helper';
class HistoryService {
  async create(data: HistoryDoc) {
    return await create(HistoryModel, data);
  }

  async getById(id: string) {
    return await HistoryModel.findById(id);
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

    return await HistoryModel.bulkWrite(bulkOperations);
  }

  async update(id: string, data: any) {
    return await HistoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await HistoryModel.findByIdAndUpdate(id, {
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
    return await paginatedData(HistoryModel, match, sort, page, perPage);
  }
}

export default new HistoryService();
