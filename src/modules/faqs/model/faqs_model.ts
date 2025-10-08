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

export interface FaqsDocument extends Document {
  question: string;
  answer: string;
}

const FaqsSchema = new Schema<FaqsDocument>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
);

FaqsSchema.plugin(mongoosePaginate);
FaqsSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const defaultComponentOverrides: Record<string, string> = {
  answer: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
FaqsSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

FaqsSchema.statics.getTableFields = function () {
  return ['question'];
};

FaqsSchema.statics.getSingleInstanceState = function () {
  return false;
};
FaqsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'faqs',
      id: ret._id,
      question: ret.question,
      answer: ret.answer,
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IFaqsModel extends PaginateModel<FaqsDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
}
export const FaqsModel = model<FaqsDocument, IFaqsModel>('Faq', FaqsSchema);
