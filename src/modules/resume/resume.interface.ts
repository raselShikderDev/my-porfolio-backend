import { IUser } from '../users/user.interface';

export interface IResume {
  id: number;
  userId: number;
  resumeUrl: string;
  fileName?: string;
  uploadedAt: Date;
  updatedAt: Date;
  user?: IUser;
}