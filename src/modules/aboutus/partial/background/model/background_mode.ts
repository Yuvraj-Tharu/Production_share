import mongoose, {
  Schema,
  model,
  Document,
  PaginateModel,
  Types,
} from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { getFormattedDate } from 'helper/data_format_helper';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';

export interface BackgroundDocument extends Document {
  title: string;
  firstDescription: string;
  firstImage: IImage;
  secondDescription: string;
  secondImage: IImage;
  fotterText?: string;
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

const backgroundSchema = new Schema<BackgroundDocument>(
  {
    title: { type: String, required: true },
    firstDescription: { type: String, required: true },
    firstImage: { type: ImageSchema, required: true },
    secondDescription: { type: String, required: true },
    secondImage: { type: ImageSchema, required: true },
    fotterText: { type: String, required: false },
  },
  { timestamps: true },
);

backgroundSchema.plugin(mongoosePaginate);
backgroundSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  firstDescription: 'RichTextEditor',
  secondDescription: 'RichTextEditor',
  firstImage: {
    url: 'ImageUpload',
  },
  secondImage: {
    url: 'ImageUpload',
  },
  fotterText: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
backgroundSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

backgroundSchema.statics.getTableFields = function () {
  return ['title', 'firstImage.url', 'secondImage.url'];
};

backgroundSchema.statics.getSingleInstanceState = function () {
  return true;
};
backgroundSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'background',
      id: ret._id,
      title: ret.title,
      firstDescription: ret.firstDescription,
      firstImage: ret.firstImage,
      secondDescription: ret.secondDescription,
      secondImage: ret.secondImage,
      fotterText: ret.fotterText,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IFaqsModel extends PaginateModel<BackgroundDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
}
export const BackgroundModel = model<BackgroundDocument, IFaqsModel>(
  'Background',
  backgroundSchema,
);
