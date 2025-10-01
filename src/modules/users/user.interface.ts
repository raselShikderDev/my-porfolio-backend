import { IsActive } from "@prisma/client";
import { IBlog } from "../blog/blog.interface";
import { IProject } from "../project/project.interface";
import { IWorkExperince } from "../workExperience/workExperience.interface";

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  GUIDE = "GUIDE",
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avater?: string;
  skills: string[];
  address: string;
  phone: number;
  isActive: IsActive;
  role: Role;
  isVerified: boolean;
  github: string;
  linkedin: string;
  twitter: string;
  createdAt: Date;
  updatedAt: Date;
  Blog?: IBlog[];
  Project?: IProject[];
  WorkExperince?: IWorkExperince[];
}
