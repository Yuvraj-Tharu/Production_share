import BreadcrumbModel, { IBreadcrumb } from '../model/breadcrumb_model';
import { create } from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';
class BreadcrumbService {
  public async createBreadcrumb(data: IBreadcrumb): Promise<IBreadcrumb> {
    return await create<IBreadcrumb>(BreadcrumbModel, data);
  }

  public async getBreadcrumb(
    matchData: any,
    sortData: any,
    page: number,
    perPage: number,
  ) {
    return await paginatedData<IBreadcrumb>(
      BreadcrumbModel,
      matchData,
      sortData,
      page,
      perPage,
    );
  }

  public async getBreadcrumbById(id: string): Promise<IBreadcrumb | null> {
    return BreadcrumbModel.findById(id);
  }

  public async updateBreadcrumb(
    id: string,
    data: IBreadcrumb,
  ): Promise<IBreadcrumb | null> {
    return BreadcrumbModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteBreadcrumb(id: string): Promise<IBreadcrumb | null> {
    return await BreadcrumbModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
  }
}

export default new BreadcrumbService();
