import AboutUs, { IAboutUs } from '../model/about_us_model';

class AboutUsService {
  async createAboutUs(data: IAboutUs) {
    const aboutus = await AboutUs.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return aboutus;
  }

  public async getAboutUs(): Promise<IAboutUs | null> {
    return AboutUs.findOne({});
  }
}

export default new AboutUsService();
