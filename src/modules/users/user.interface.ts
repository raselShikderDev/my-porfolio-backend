import { IBlog } from "../blog/blog.interface";
import { IProject } from "../project/project.interface";
import { IWorkExperince } from "../workExperience/workExperience.interface";


export interface IUser {
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
  Blog?: IBlog[];
  Project?: IProject[];
  WorkExperince?: IWorkExperince[];
}
