import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';
export interface SubscriptionDocument extends Document {
  email: string;
  status?: boolean;
  terms: boolean;
  seo?: ISEO;
}

const seoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogUrl: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false },
);

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    email: { type: String, required: true, unique: true },
    terms: { type: Boolean, required: true, default: false },
    status: { type: Boolean, default: false },
    seo: { type: seoSchema },
  },

  { timestamps: true },
);

SubscriptionSchema.plugin(mongoosePaginate);
SubscriptionSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<string, string> = {
  email: 'Email',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
SubscriptionSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

SubscriptionSchema.statics.getTableFields = function () {
  return ['email'];
};

SubscriptionSchema.statics.getSingleInstanceState = function () {
  return false;
};
SubscriptionSchema.statics.getViewOnlyFields = function () {
  return true;
};

SubscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'subscription',
      id: ret._id,
      email: ret.email,
      status: ret.status,
      terms: ret.terms,
      seo: ret.seo || {},
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface ISubscriptionModel extends PaginateModel<SubscriptionDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getViewOnlyFields: () => boolean;
}
const SubscriptionModel = model<SubscriptionDocument, ISubscriptionModel>(
  'Subscription',
  SubscriptionSchema,
);

export default SubscriptionModel;
