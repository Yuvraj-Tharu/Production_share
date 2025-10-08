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

export interface ObjectivesDocument extends Document {
  title: string;
  image: IImage;
  listItems: string[];
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

const objectivesSchema = new Schema<ObjectivesDocument>(
  {
    title: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    listItems: { type: [String], required: true },
  },
  { timestamps: true },
);

objectivesSchema.plugin(mongoosePaginate);
objectivesSchema.plugin(mongooseDelete, {
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
  listItems: 'ArrayInputString',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
objectivesSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

objectivesSchema.statics.getTableFields = function () {
  return ['title', 'image.url'];
};

objectivesSchema.statics.getSingleInstanceState = function () {
  return true;
};
objectivesSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'objectives',
      id: ret._id,
      title: ret.title,
      image: ret.image,
      listItems: ret.listItems,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IFaqsModel extends PaginateModel<ObjectivesDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
}
export const ObjectivesModel = model<ObjectivesDocument, IFaqsModel>(
  'Objectives',
  objectivesSchema,
);
