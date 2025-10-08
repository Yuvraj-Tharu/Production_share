import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';

export interface HomeSectionDocuments extends Document {
  title: string;
  description: string;
  firstImage?: IImage;
  secondImage?: IImage;
  home: Types.ObjectId;
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

const HomeSectionSchema = new Schema<HomeSectionDocuments>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    firstImage: { type: ImageSchema, required: false },
    secondImage: { type: ImageSchema, required: false },
    home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  },
  { timestamps: true },
);

HomeSectionSchema.plugin(mongoosePaginate);
HomeSectionSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  string | Record<string, string>
> = {
  description: 'RichTextEditor',
  firstImage: {
    url: 'ImageUpload',
  },
  secondImage: {
    url: 'ImageUpload',
  },
  home: 'AutoComplete',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {
  Home: { model: 'Home', strField: 'title' },
};
HomeSectionSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

HomeSectionSchema.statics.getTableFields = function () {
  return ['title', 'firstImage.url', 'secondImage.url'];
};

HomeSectionSchema.statics.getSingleInstanceState = function () {
  return true;
};

HomeSectionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      id: ret._id,
      title: ret.title,
      description: ret.description,
      firstImage: ret.firstImage,
      secondImage: ret.secondImage,
      home: ret.home,
      createdAt: getFormattedDate(ret.createdAt),
      updatedAt: getFormattedDate(ret.updatedAt),
    };
  },
});

interface IBrandModel extends PaginateModel<HomeSectionDocuments> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
export const HomeSectionModel = model<HomeSectionDocuments, IBrandModel>(
  'HomeSection',
  HomeSectionSchema,
);
