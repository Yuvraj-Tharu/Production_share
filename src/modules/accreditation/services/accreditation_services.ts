import Accreditation, {
  AccreditationDocuments,
} from '../model/accreditation_model';
import { create } from 'helper/service_helper';
import { paginatedData } from '@utils/pagination';
class AccreditationServices {
  static async getAllBrand(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(Accreditation, match, sort, page, perPage);
  }

  static async createBrand(data: any): Promise<AccreditationDocuments | null> {
    const brand = await create(Accreditation, data);
    return brand;
  }

  static async getBrandById(
    id: string,
  ): Promise<AccreditationDocuments | null> {
    return await Accreditation.findById(id);
  }

  static async deleteBrand(id: string): Promise<AccreditationDocuments | null> {
    return await Accreditation.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
  }

  static async updateBrand(
    id: string,
    data: AccreditationDocuments,
  ): Promise<AccreditationDocuments | null> {
    return await Accreditation.findByIdAndUpdate(id, data, { new: true });
  }
}

export default AccreditationServices;
