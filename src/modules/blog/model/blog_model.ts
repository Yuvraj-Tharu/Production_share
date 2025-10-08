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

export interface BlogDocument extends Document {
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

const BlogSchema = new Schema<BlogDocument>(
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

// async function generateUniqueSlug(title: string, id: string): Promise<string> {
//   let slug = slugify(title, { lower: true });
//   let counter = 1;

//   while (await Blog.findOne({ slug, _id: { $ne: id } })) {
//     slug = slugify(`${title}-${counter}`, { lower: true });
//     counter++;
//   }

//   return slug;
// }

BlogSchema.pre<BlogDocument>(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    // if (this.isModified('title')) {
    //   this.slug = await generateUniqueSlug(this.title, this.id.toString());
    // }
    if (this.isModified('description')) {
      this.readTime = calculateReadTime(this.description);
    }
    next();
  },
);

BlogSchema.pre(
  'findOneAndUpdate',
  async function (next: CallbackWithoutResultAndOptionalError) {
    const update = this.getUpdate() as UpdateQuery<BlogDocument>;
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

BlogSchema.plugin(mongoosePaginate);
BlogSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

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

BlogSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

BlogSchema.statics.getTableFields = function () {
  return ['title', 'category', 'image.url'];
};

BlogSchema.statics.getSingleInstanceState = function () {
  return false;
};

BlogSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<BlogDocument>;

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

BlogSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'blogs',
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

interface IBlogModel extends PaginateModel<BlogDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
}

const Blog = model<BlogDocument, IBlogModel>('Blog', BlogSchema);

export default Blog;
