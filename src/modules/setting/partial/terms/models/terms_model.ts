import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';
export interface ITerms extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  seo?: ISEO;
}
const seoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false },
);

const TermsSchema = new Schema<ITerms>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    // seo: { type: seoSchema },
  },
  { timestamps: true },
);

TermsSchema.plugin(mongoosePaginate);
TermsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<string, string> = {
  content: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
TermsSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

TermsSchema.statics.getTableFields = function () {
  return ['title'];
};

TermsSchema.statics.getSingleInstanceState = function () {
  return true;
};

TermsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'terms',
      id: ret._id,
      title: ret.title,
      content: ret.content,
      // seo: ret.seo || {},
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface ITermsModel extends PaginateModel<ITerms> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const Terms = model<ITerms, ITermsModel>('Term', TermsSchema);

export default Terms;
