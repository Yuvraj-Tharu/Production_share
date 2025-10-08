import { getFormattedDate } from 'helper/data_format_helper';
import { IImage } from 'interface/image_interface';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';

export interface CentreDoc extends Document {
  name: string;
  image: IImage; // Changed from 'icon' to match schema
  email?: string;
  websiteLink?: string;
  phone?: string;
  address?: string; // This field should be added to schema if needed
  position: string; // Added since it's in the schema
  displayPosition?: number; // Added since it's in the schema
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

const memberSchema = new Schema<CentreDoc>(
  {
    name: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false }, // Added the missing address field
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

// Removed duplicate plugin call
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
      object: 'committee_member', // Fixed typo
      id: ret._id,
      image: ret.image,
      name: ret.name,
      position: ret.position,
      email: ret.email,
      phone: ret.phone,
      address: ret.address, // Added address field
      displayPosition: ret.displayPosition,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface ITeamModel extends PaginateModel<CentreDoc> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getReorderFields: () => boolean;
}

export const CommitteMemberModel = model<CentreDoc, ITeamModel>(
  'CommitteMember',
  memberSchema,
);
