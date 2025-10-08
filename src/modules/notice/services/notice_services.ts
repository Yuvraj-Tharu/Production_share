import { paginatedData } from '@utils/pagination';
import { NoticeDocument, NoticeModel } from '../model/notice_model';
import { UpdateQuery } from 'mongoose';
class NoticeService {
  async getAllNotice(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(NoticeModel, match, sort, page, perPage, author);
  }

  async getNoticeBySlug(slug: string): Promise<{
    blog: NoticeDocument | null;
    relatedBlogs: NoticeDocument[];
  }> {
    const blog = await NoticeModel.findOne({ slug }).populate('author');

    if (!blog) {
      return { blog: null, relatedBlogs: [] };
    }

    const relatedBlogs = await NoticeModel.find({
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .populate('author')
      .limit(4);

    return { blog, relatedBlogs };
  }

  async createNotice(data: Partial<NoticeDocument>): Promise<NoticeDocument> {
    return NoticeModel.create(data);
  }

  async updateNotice(
    id: string,
    data: Partial<NoticeDocument>,
  ): Promise<NoticeDocument | null> {
    const updateQuery: UpdateQuery<NoticeDocument> = { ...data };
    return await NoticeModel.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  async deleteNotice(id: string): Promise<NoticeDocument | null> {
    return NoticeModel.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }

  async favoriteNotice(slug: string): Promise<NoticeDocument | null> {
    const blog = await NoticeModel.findOne({ slug });
    if (blog) {
      blog.favorites += 1;
      return blog.save();
    }
    return null;
  }

  async addComment(
    slug: string,
    comment: { comment: string; name: string; email: string },
  ): Promise<NoticeDocument | null> {
    const blog = await NoticeModel.findOne({ slug });
    if (blog) {
      blog.comments.push(comment);
      return blog.save();
    }
    return null;
  }

  async getTrendingNotice(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(
      NoticeModel,
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
  }

  async getLatestNotice(
    matchData: Record<string, any>,
    sortData: Record<string, any>,
    page: number,
    perPage: number,
    author: any,
  ) {
    return await paginatedData(
      NoticeModel,
      matchData,
      sortData,
      page,
      perPage,
      author,
    );
  }
}

export default new NoticeService();
