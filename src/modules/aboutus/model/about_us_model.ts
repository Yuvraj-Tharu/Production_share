import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ISEO } from 'interface/seo_interface';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';
export interface IAboutUs extends Document {
  title: string;
  description: string;
  firstImage?: IImage;
  secondImage?: IImage;
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

const aboutUsSchema = new Schema<IAboutUs>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    firstImage: { type: ImageSchema, required: false },
    secondImage: { type: ImageSchema, required: false },
  },
  { timestamps: true },
);

aboutUsSchema.plugin(mongoosePaginate);
aboutUsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  description: 'RichTextEditor',
  firstImage: {
    url: 'ImageUpload',
  },
  secondImage: {
    url: 'ImageUpload',
  },
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
aboutUsSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

aboutUsSchema.statics.getTableFields = function () {
  return ['title', 'firstImage.url', 'secondImage.url'];
};

aboutUsSchema.statics.getSingleInstanceState = function () {
  return true;
};

aboutUsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'about_us',
      id: ret._id,
      title: ret.title,
      description: ret.description,
      firstImage: ret.firstImage,
      secondImage: ret.secondImage,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IAboutUsModel extends PaginateModel<IAboutUs> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const AboutUs = model<IAboutUs, IAboutUsModel>('AboutUs', aboutUsSchema);

export default AboutUs;
