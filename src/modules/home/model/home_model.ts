import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';
export interface HomeDocument extends Document {
  title: string;
  subtitle: string;
  image: IImage;
}

const imageSchema = new Schema<IImage>(
  {
    url: { type: String, required: false },
    title: { type: String, required: false },
    caption: { type: String, required: false },
    alt: { type: String, required: false },
  },
  { _id: false },
);

const HomeSchema = new Schema<HomeDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: imageSchema, required: false },
  },
  { timestamps: true },
);

HomeSchema.plugin(mongoosePaginate);
HomeSchema.plugin(mongooseDelete, {
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
HomeSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

HomeSchema.statics.getTableFields = function () {
  return ['title', 'image.url'];
};

HomeSchema.statics.getSingleInstanceState = function () {
  return true;
};
HomeSchema.virtual('missionVision', {
  ref: 'MissionVision',
  localField: '_id',
  foreignField: 'home',
  justOne: true,
});

HomeSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'home',
      id: ret._id,
      title: ret.title,
      subtitle: ret.subtitle,
      image: ret.image,
      missionVision: ret.missionVision,
      created_data: getFormattedDate(ret.createdAt),
      updated_data: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IHomeModel extends PaginateModel<HomeDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
export const Home = model<HomeDocument, IHomeModel>('Home', HomeSchema);
