import { getFormattedDate } from 'helper/data_format_helper';
import { ISEO } from 'interface/seo_interface';
import mongoose, {
  Schema,
  model,
  Document,
  PaginateModel,
  Types,
  CallbackWithoutResultAndOptionalError,
  UpdateQuery,
} from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { IImage } from 'interface/image_interface';
interface Comment {
  comment: string;
  name: string;
  email: string;
}

export interface NoticeDocument extends Document {
  title: string;
  slug: string;
  author: Types.ObjectId;
  image: IImage;
  description: string;
  favorites: number;
  comments: Comment[];
  seo?: ISEO;
  category: string;
  readTime: string;
}

const seoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogUrl: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false },
);

const CommentSchema = new Schema<Comment>({
  comment: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const ImageSchema = new Schema<IImage>(
  {
    url: { type: String, required: true },
    title: { type: String, required: false },
    caption: { type: String, required: false },
    alt: { type: String, required: false },
  },
  { _id: false },
);

const noticeSchema = new Schema<NoticeDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: ImageSchema, required: true },
    description: { type: String, required: true },
    favorites: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
    category: { type: String, required: true },
    readTime: { type: String, required: false },
    seo: { type: seoSchema },
  },
  { timestamps: true },
);

function calculateReadTime(description: string): string {
  const wordsPerMinute = 200;
  const wordCount = description.trim().split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readTimeMinutes} min read`;
}

noticeSchema.pre<NoticeDocument>(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.isModified('description')) {
      this.readTime = calculateReadTime(this.description);
    }
    next();
  },
);

noticeSchema.pre(
  'findOneAndUpdate',
  async function (next: CallbackWithoutResultAndOptionalError) {
    const update = this.getUpdate() as UpdateQuery<NoticeDocument>;
    const description = update.description || update.$set?.description;
    if (description) {
      const readTime = calculateReadTime(description);
      if (update.$set) {
        update.$set.readTime = readTime;
      } else {
        update.readTime = readTime;
      }
    }
    next();
  },
);

noticeSchema.plugin(mongoosePaginate);
noticeSchema.plugin(mongooseDelete, {
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
  description: 'RichTextEditor',
  tags: 'MultiValuesInput',
  type: 'EnumSelectInput',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};

noticeSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

noticeSchema.statics.getTableFields = function () {
  return ['title', 'category', 'image.url'];
};

noticeSchema.statics.getSingleInstanceState = function () {
  return false;
};

noticeSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<NoticeDocument>;

  const newType = update.type || update.$set?.type;
  if (newType === 'feature') {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      await this.model.updateMany(
        { _id: { $ne: doc._id } },
        { $set: { type: 'new' } },
      );
    }
  }

  next();
});

noticeSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'notices',
      id: ret._id,
      title: ret.title,
      readTime: ret.readTime,
      slug: ret.slug,
      category: ret.category,
      author: ret.author,
      image: ret.image,
      description: ret.description,
      type: ret.type,
      favorites: ret.favorites,
      comments: ret.comments,
      seo: ret.seo || {},
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});

interface IBlogModel extends PaginateModel<NoticeDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}

export const NoticeModel = model<NoticeDocument, IBlogModel>(
  'Notice',
  noticeSchema,
);
