import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, Types, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';

export enum ContactUsStatus {
  Pending = 'pending',
  FollowedUp = 'followed-up',
}
export interface INote {
  message: string;
  notedBy: Types.ObjectId;
}
export interface ContactUsDocument extends Document {
  name: string;
  phone: string;
  email: string;
  message: string;
  subject: string;
  status: ContactUsStatus;
  followUpNote?: INote;
  seo?: ISEO;
}
const followUpNoteSchema = new Schema(
  {
    message: { type: String, required: true },
    notedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { _id: false },
);

const ContactUsSchema = new Schema<ContactUsDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false },
    subject: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(ContactUsStatus),
      default: ContactUsStatus.Pending,
    },
    followUpNote: { type: followUpNoteSchema, required: false },
  },
  { timestamps: true },
);

ContactUsSchema.plugin(mongoosePaginate);
ContactUsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<string, string> = {};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
ContactUsSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

ContactUsSchema.statics.getTableFields = function () {
  return ['name', 'phone', 'email', 'status'];
};

ContactUsSchema.statics.getSingleInstanceState = function () {
  return false;
};
ContactUsSchema.statics.getViewOnlyFields = function () {
  return true;
};

ContactUsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'contacts',
      id: ret._id,
      name: ret.name,
      phone: ret.phone,
      email: ret.email,
      message: ret.message,
      subject: ret.subject,
      status: ret.status,
      followUpNote: ret.followUpNote,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface IContactUsModel extends PaginateModel<ContactUsDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getViewOnlyFields: () => boolean;
}

export const ContactUs = model<ContactUsDocument, IContactUsModel>(
  'ContactUs',
  ContactUsSchema,
);
