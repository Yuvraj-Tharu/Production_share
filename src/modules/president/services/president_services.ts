import { paginatedData } from '@utils/pagination';
import { PresidentDocuments, PresidentModel } from '../model/president_model';
import { create } from 'helper/service_helper';

class PresidentService {
  public async create(data: PresidentDocuments) {
    return await create(PresidentModel, data);
  }

  public async getById(id: string): Promise<PresidentDocuments | null> {
    return await PresidentModel.findById(id);
  }

  public async reorderItems(
    updatedItems: { id: string; displayPosition: number }[],
  ) {
    const bulkOperations = updatedItems.map(
      (item: { id: string; displayPosition: number }) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { displayPosition: item.displayPosition } },
        },
      }),
    );

    return await PresidentModel.bulkWrite(bulkOperations);
  }

  public async update(
    id: string,
    data: PresidentDocuments,
  ): Promise<PresidentDocuments | null> {
    return await PresidentModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<PresidentDocuments | null> {
    return await PresidentModel.findByIdAndUpdate(id, {
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
    return await paginatedData(PresidentModel, match, sort, page, perPage);
  }
}

export default new PresidentService();
