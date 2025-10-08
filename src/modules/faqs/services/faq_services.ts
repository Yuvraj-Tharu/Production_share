import { FaqsModel, FaqsDocument } from '../model/faqs_model';
import { paginatedData } from '@utils/pagination';
import { create } from 'helper/service_helper';
class FaqServices {
  public async getFaqs(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(FaqsModel, match, sort, page, perPage);
  }

  public async createFaq(data: Partial<FaqsDocument>): Promise<FaqsDocument> {
    const faq = await create<FaqsDocument>(FaqsModel, data);
    return faq;
  }

  public async updateFaq(
    id: string,
    data: Partial<FaqsDocument>,
  ): Promise<FaqsDocument | null> {
    const updatedFaq = await FaqsModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedFaq;
  }

  public async deleteFaq(id: string): Promise<FaqsDocument | null> {
    const deletedFaq = await FaqsModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
    return deletedFaq;
  }
  public async getFaqById(id: string): Promise<FaqsDocument | null> {
    return await FaqsModel.findById(id);
  }
}

export default new FaqServices();
