import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseDelete from 'mongoose-delete';
import { getFormattedDate } from 'helper/data_format_helper';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';

export interface ISocialMedia {
  facebook: string;
  youtube: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
}

export interface IEmail {
  general: string;
  jobs: string;
  employers: string;
  support: string;
}

export interface IPhoneNumber {
  Main: string;
  HR: string;
  Recruitment: string;
}

export interface Ilocation {
  name: string;
  address: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IworkingHours {
  openingDays: string;
  openingHours: string;
  closingDays: string;
  emergency: string;
}

const EmailSchema = new Schema<IEmail>(
  {
    general: { type: String, required: false },
    jobs: { type: String, required: false },
    employers: { type: String, required: false },
    support: { type: String, required: false },
  },
  { _id: false },
);

const PhoneNumberSchema = new Schema<IPhoneNumber>(
  {
    Main: { type: String, required: false },
    HR: { type: String, required: false },
    Recruitment: { type: String, required: false },
  },
  { _id: false },
);

const locationSchema = new Schema<Ilocation>(
  {
    name: { type: String, required: false },
    address: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  { _id: false },
);

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: false },
    title: { type: String, required: false },
    caption: { type: String, required: false },
    alt: { type: String, required: false },
  },
  { _id: false },
);

export interface ISetting extends Document {
  headerLogo: IImage;
  footerLogo: IImage;
  phoneNumber: string;
  location: string;
  email: string;
  staffEmail: IEmail;
  staffPhoneNumber: IPhoneNumber;
  officeLocation: Ilocation;
  footerDescription: string;
  mapUrl: string;
  copyRight: string;
  socialMedia: ISocialMedia;
  workingHours?: IworkingHours;
}

const SocialMediaSchema = new Schema(
  {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    twitter: { type: String },
    whatsapp: { type: String },
  },
  { _id: false },
);

const WorkingHoursSchema = new Schema<IworkingHours>(
  {
    openingDays: { type: String, required: false },
    openingHours: { type: String, required: false },
    closingDays: { type: String, required: false },
    emergency: { type: String, required: false },
  },
  { _id: false },
);
const SettingSchema = new Schema<ISetting>(
  {
    headerLogo: { type: ImageSchema, required: false },
    footerLogo: { type: ImageSchema, required: false },
    footerDescription: { type: String, required: false },
    socialMedia: SocialMediaSchema,
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    mapUrl: { type: String, required: false },
    email: { type: String, required: false },
    staffEmail: { type: EmailSchema, required: false },
    staffPhoneNumber: { type: PhoneNumberSchema, required: false },
    officeLocation: { type: locationSchema, required: false },
    copyRight: { type: String, required: true },
    workingHours: { type: WorkingHoursSchema, required: false },
  },
  { timestamps: true },
);

SettingSchema.plugin(mongoosePaginate);
SettingSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  headerLogo: {
    url: 'ImageUpload',
  },
  footerLogo: {
    url: 'ImageUpload',
  },
  footerDescription: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
SettingSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

SettingSchema.statics.getTableFields = function () {
  return ['email', 'phoneNumber', 'headerLogo.url', 'footerLogo.url'];
};

SettingSchema.statics.getSingleInstanceState = function () {
  return true;
};
SettingSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'setting',
      id: ret._id,
      headerLogo: ret.headerLogo,
      footerLogo: ret.footerLogo,
      phoneNumber: ret.phoneNumber,
      location: ret.location,
      mapUrl: ret.mapUrl,
      copyRight: ret.copyRight,
      email: ret.email,
      staffEmail: ret.staffEmail,
      staffPhoneNumber: ret.staffPhoneNumber,
      officeLocation: ret.officeLocation,
      socialMedia: ret.socialMedia,
      footerDescription: ret.footerDescription,
      workingHours: ret.workingHours,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface ISettingModel extends PaginateModel<ISetting> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}

const Setting = model<ISetting, ISettingModel>('Setting', SettingSchema);

export default Setting;
