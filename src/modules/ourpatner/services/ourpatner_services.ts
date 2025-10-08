import { OurPatnerDocuments, OurPatner } from '../model/ourpatner_model';
import { create } from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';
class PatnerServices {
  static async getAllBrand(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(OurPatner, match, sort, page, perPage);
  }

  static async createBrand(data: any): Promise<OurPatnerDocuments | null> {
    const brand = await create(OurPatner, data);
    return brand;
  }

  static async getBrandById(id: string): Promise<OurPatnerDocuments | null> {
    return await OurPatner.findById(id);
  }

  static async deleteBrand(id: string): Promise<OurPatnerDocuments | null> {
    return await OurPatner.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
  }

  static async updateBrand(
    id: string,
    data: OurPatnerDocuments,
  ): Promise<OurPatnerDocuments | null> {
    return await OurPatner.findByIdAndUpdate(id, data, { new: true });
  }
}

export default PatnerServices;
