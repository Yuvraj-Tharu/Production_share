import { getFormattedDate } from 'helper/data_format_helper';
import { IImage } from 'interface/image_interface';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';

export interface IMember extends Document {
  name: string;
  image: IImage;
  position: string;
  phone?: string;
  email?: string;
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
const memberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    displayPosition: { type: Number, required: false },
  },
  { timestamps: true },
);

memberSchema.plugin(mongoosePaginate);
memberSchema.plugin(mongooseDelete, {
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
  email: 'Email',
  displayPosition: 'NumberField',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
memberSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

memberSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});
memberSchema.statics.getTableFields = function () {
  return ['name', 'email', 'position', 'image.url'];
};

memberSchema.statics.getSingleInstanceState = function () {
  return false;
};
memberSchema.statics.getReorderFields = function () {
  return true;
};

memberSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'comittee_member',
      id: ret._id,
      image: ret.image,
      name: ret.name,
      position: ret.position,
      email: ret.email,
      phone: ret.phone,
      displayPosition: ret.displayPosition,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface ITeamModel extends PaginateModel<IMember> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getReorderFields: () => boolean;
}
export const CommitteMemberModel = model<IMember, ITeamModel>(
  'CommitteMember',
  memberSchema,
);
