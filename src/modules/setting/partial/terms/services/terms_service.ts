import Terms, { ITerms } from '../models/terms_model';

class TermsService {
  async upsert(data: ITerms): Promise<ITerms> {
    const existingTerms = await Terms.findOne();

    if (existingTerms) {
      return (await Terms.findByIdAndUpdate(
        existingTerms._id,
        { $set: data },
        { new: true },
      )) as ITerms;
    }

    return await Terms.create(data);
  }

  async get(): Promise<ITerms | null> {
    return await Terms.findOne();
  }

  async delete(id: string): Promise<ITerms | null> {
    return await Terms.findByIdAndDelete(id);
  }
}

export default new TermsService();
