import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';
export interface PresidentDocuments extends Document {
  name: string;
  image: IImage;
  position: string;
  message: string;
  joiningDate?: Date;
  resigningDate?: Date;
  displayPosition?: number;
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

const presidentSchema = new Schema<PresidentDocuments>(
  {
    name: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    position: { type: String, required: true },
    message: { type: String, required: true },
    joiningDate: { type: Date, required: false },
    resigningDate: { type: Date, required: false },
    displayPosition: { type: Number, required: false },
  },
  { timestamps: true },
);

presidentSchema.plugin(mongoosePaginate);
presidentSchema.plugin(mongooseDelete, {
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
  message: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
presidentSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

presidentSchema.statics.getTableFields = function () {
  return ['name', 'position', 'image.url'];
};

presidentSchema.statics.getSingleInstanceState = function () {
  return false;
};

presidentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      object: 'president',
      id: ret._id,
      name: ret.name,
      image: ret.image,
      position: ret.position,
      message: ret.message,
      joiningDate: ret.joiningDate,
      resigningDate: ret.resigningDate,
      displayPosition: ret.displayPosition,
      createdAt: getFormattedDate(ret.createdAt),
      updatedAt: getFormattedDate(ret.updatedAt),
    };
  },
});

interface IBrandModel extends PaginateModel<PresidentDocuments> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
export const PresidentModel = model<PresidentDocuments, IBrandModel>(
  'President',
  presidentSchema,
);
