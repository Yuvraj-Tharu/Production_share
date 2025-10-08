import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';
import { IImage } from 'interface/image_interface';

export enum BreadcrumbType {
  AboutUs = 'about-us',
  ExecutiveCommittee = 'executive-committee',
  
}
export interface IBreadcrumb extends Document {
  title: string;
  subtitle: string;
  image: IImage;
  type: BreadcrumbType;
  seo?: ISEO;
}

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true },
    title: { type: String, required: false },
    caption: { type: String, required: false },
    alt: { type: String, required: false },
  },
  { _id: false },
);
const breadcrumbSchema = new Schema<IBreadcrumb>(
  {
    title: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    type: {
      type: String,
      required: false,
      enum: Object.values(BreadcrumbType),
    },
  },
  { timestamps: true },
);

breadcrumbSchema.plugin(mongoosePaginate);
breadcrumbSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  image: {
    url: 'ImageUpload',
  },
  type: 'EnumSelectInput',
  subtitle: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
breadcrumbSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

breadcrumbSchema.statics.getTableFields = function () {
  return ['title', 'image.url'];
};

breadcrumbSchema.statics.getSingleInstanceState = function () {
  return false;
};

breadcrumbSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'bread_crumb',
      id: ret._id,
      title: ret.title,
      image: ret.image,
      type: ret.type,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface IBreadCrumModel extends PaginateModel<IBreadcrumb> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const BreadcrumbModel = model<IBreadcrumb, IBreadCrumModel>(
  'Breadcrumb',
  breadcrumbSchema,
);

export default BreadcrumbModel;
