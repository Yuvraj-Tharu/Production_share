import { getFormattedDate } from 'helper/data_format_helper';
import { IImage } from 'interface/image_interface';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';

export interface ITeam extends Document {
  name: string;
  image: IImage;
  position: string;
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
const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    position: { type: String, required: true },
    displayPosition: { type: Number, required: false },
  },
  { timestamps: true },
);

TeamSchema.plugin(mongoosePaginate);
TeamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  image: {
    url: 'ImageUpload',
  },
  displayPosition: 'NumberField',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
TeamSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

TeamSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});
TeamSchema.statics.getTableFields = function () {
  return ['name', 'position', 'image.url'];
};

TeamSchema.statics.getSingleInstanceState = function () {
  return false;
};
TeamSchema.statics.getReorderFields = function () {
  return true;
};

TeamSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'team',
      id: ret._id,
      image: ret.image,
      name: ret.name,
      position: ret.position,
      displayPosition: ret.displayPosition,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface ITeamModel extends PaginateModel<ITeam> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getReorderFields: () => boolean;
}
const Team = model<ITeam, ITeamModel>('Team', TeamSchema);

export default Team;
