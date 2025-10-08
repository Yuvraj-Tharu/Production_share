import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';

export interface HistoryDoc extends Document {
  title: string;
  description: string;
  displayPosition?: number;
}

const historySchema = new Schema<HistoryDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    displayPosition: { type: Number, required: false },
  },
  { timestamps: true },
);

historySchema.plugin(mongoosePaginate);
historySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<
  string,
  Record<string, string> | string
> = {
  displayPosition: 'NumberField',
  description: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
historySchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

historySchema.statics.getTableFields = function () {
  return ['title'];
};

historySchema.statics.getSingleInstanceState = function () {
  return false;
};

historySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'bread_crumb',
      id: ret._id,
      title: ret.title,
      description: ret.description,
      displayPosition: ret.displayPosition,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface IBreadCrumModel extends PaginateModel<HistoryDoc> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}
export const HistoryModel = model<HistoryDoc, IBreadCrumModel>(
  'History',
  historySchema,
);
