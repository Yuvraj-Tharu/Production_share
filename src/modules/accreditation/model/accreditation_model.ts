import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';
import { IImage } from 'interface/image_interface';
export interface AccreditationDocuments extends Document {
  accreditationName: string;
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

const AccreditationSchema = new Schema<AccreditationDocuments>(
  {
    accreditationName: { type: String, required: true },
    image: { type: ImageSchema, required: true },
  },
  { timestamps: true },
);

AccreditationSchema.plugin(mongoosePaginate);
AccreditationSchema.plugin(mongooseDelete, {
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
AccreditationSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

AccreditationSchema.statics.getTableFields = function () {
  return ['accreditationName', 'image.url'];
};

AccreditationSchema.statics.getSingleInstanceState = function () {
  return false;
};

AccreditationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      id: ret._id,
      accreditationName: ret.accreditationName,
      image: ret.image,
      createdAt: getFormattedDate(ret.createdAt),
      updatedAt: getFormattedDate(ret.updatedAt),
    };
  },
});

interface IBrandModel extends PaginateModel<AccreditationDocuments> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
const Accreditation = model<AccreditationDocuments, IBrandModel>(
  'Accreditation',
  AccreditationSchema,
);
export default Accreditation;
