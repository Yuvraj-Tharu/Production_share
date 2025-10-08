import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';
export interface OurPatnerDocuments extends Document {
  patnerName: string;
  image: IImage;
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

const patnerSchema = new Schema<OurPatnerDocuments>(
  {
    patnerName: { type: String, required: true },
    image: { type: ImageSchema, required: true },
  },
  { timestamps: true },
);

patnerSchema.plugin(mongoosePaginate);
patnerSchema.plugin(mongooseDelete, {
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
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
patnerSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

patnerSchema.statics.getTableFields = function () {
  return ['patnerName', 'image.url'];
};

patnerSchema.statics.getSingleInstanceState = function () {
  return false;
};

patnerSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      id: ret._id,
      patnerName: ret.patnerName,
      image: ret.image,
      createdAt: getFormattedDate(ret.createdAt),
      updatedAt: getFormattedDate(ret.updatedAt),
    };
  },
});

interface IBrandModel extends PaginateModel<OurPatnerDocuments> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
export const OurPatner = model<OurPatnerDocuments, IBrandModel>(
  'OurPatner',
  patnerSchema,
);
