import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';

export enum SeoType {
  Home = 'home',
  AboutUs = 'about-us',
  Service = 'service',
  HowWeWork = 'how-we-work',
  Client = 'client',
  Career = 'career',
  ContactUs = 'contact-us',
  FAQs = 'faqs',
}

export interface SeoDocuments extends Document {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: string;
  customHeader?: string;
  seoFor: SeoType;
}

const SeoSchema = new Schema<SeoDocuments>(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String] },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogUrl: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    robots: {
      type: String,
      enum: [
        'index, follow',
        'noindex, follow',
        'index, nofollow',
        'noindex, nofollow',
        'max-image-preview:large',
        'index, follow, max-image-preview:large',
        'noindex, follow, max-image-preview:large',
        'index, nofollow, max-image-preview:large',
        'noindex, nofollow, max-image-preview:large',
      ],
      default: 'index, follow',
    },
    structuredData: { type: String },
    customHeader: { type: String },
    seoFor: { type: String, enum: Object.values(SeoType) },
  },
  { timestamps: true },
);

SeoSchema.plugin(mongoosePaginate);
SeoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<string, string> = {
  customHeader: 'TextArea',
  metaKeywords: 'MultiValuesInput',
  seoFor: 'EnumSelectInput',
  ogImage: 'ImageUpload',
  twitterImage: 'ImageUpload',
  structuredData: 'TextArea',
  robots: 'EnumSelectInput',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
SeoSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

SeoSchema.statics.getTableFields = function () {
  return ['seoFor', 'metaTitle', 'ogTitle'];
};

SeoSchema.statics.getSingleInstanceState = function () {
  return false;
};

SeoSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      object: 'seo',
      id: ret._id,
      metaTitle: ret.metaTitle,
      metaDescription: ret.metaDescription,
      metaKeywords: ret.metaKeywords,
      ogTitle: ret.ogTitle,
      ogDescription: ret.ogDescription,
      ogUrl: ret.ogUrl,
      ogImage: ret.ogImage,
      canonicalUrl: ret.canonicalUrl,
      robots: ret.robots,
      structuredData: ret.structuredData,
      customHeader: ret.customHeader,
      seoFor: ret.seoFor,
      createdAt: getFormattedDate(ret.createdAt),
      updatedAt: getFormattedDate(ret.updatedAt),
    };
  },
});

interface ISeoModel extends PaginateModel<SeoDocuments> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const SeoModel = model<SeoDocuments, ISeoModel>('Seo', SeoSchema);
export default SeoModel;
