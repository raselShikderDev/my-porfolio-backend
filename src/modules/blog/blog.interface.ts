import { IUser } from "../users/user.interface";

export interface IBlog {
  id: number;
  title: string;
  content?: string;
  images: string[];
  published: boolean;
  publishedDate:Date;
  slug: string;
  views: number;
  authorId: number;
  author?: IUser;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
