import SeoModel, { SeoDocuments } from '../model/seo_model';
import { create } from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';

class SeoService {
  public async createSeo(data: SeoDocuments): Promise<SeoDocuments> {
    return await create(SeoModel, data);
  }
  public async getSeoById(id: string): Promise<SeoDocuments | null> {
    return await SeoModel.findById(id).exec();
  }
  public async getSeoBySeoFor(slug: string): Promise<SeoDocuments | null> {
    return await SeoModel.findOne({ seoFor: slug }).exec();
  }

  public async getAllSeo(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(SeoModel, match, sort, page, perPage);
  }

  public async updateSeo(
    id: string,
    data: Partial<SeoDocuments>,
  ): Promise<SeoDocuments | null> {
    return await SeoModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async deleteSeo(id: string): Promise<SeoDocuments | null> {
    return await SeoModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    ).exec();
  }
}

export default new SeoService();
