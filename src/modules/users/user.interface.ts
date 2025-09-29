

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avater: string;
  skills: string[];
  address: string;
  phone: number;
  github: string;
  linkedin: string;
  twitter: string;
  createdAt: Date;
  updatedAt: Date;
  Blog: IBlog[];
  Project: string[];
  WorkExperince: string[];
}
