import { paginatedData } from '@utils/pagination';
import { ContactUs, ContactUsDocument } from '../model/contact_model';

class ContactService {
  public async getAllContacts(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
    populate: string | object | Array<string | object> = [],
  ) {
    return await paginatedData(ContactUs, match, sort, page, perPage, populate);
  }

  public async getContactById(id: string): Promise<ContactUsDocument | null> {
    return ContactUs.findById(id).populate('followUpNote.notedBy');
  }

  public async createContact(
    data: Partial<ContactUsDocument>,
  ): Promise<ContactUsDocument> {
    return ContactUs.create(data);
  }

  public async deleteContact(id: string): Promise<ContactUsDocument | null> {
    return ContactUs.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }

  public async updateContactStatus(
    id: string,
    updateNote: Partial<ContactUsDocument | any>,
  ): Promise<ContactUsDocument | null> {
    const updateData = {
      $set: {
        status: updateNote.status,
        'followUpNote.message': updateNote.followUpNote?.message,
        'followUpNote.notedBy': updateNote?.notedBy,
      },
    };
    return await ContactUs.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new ContactService();
