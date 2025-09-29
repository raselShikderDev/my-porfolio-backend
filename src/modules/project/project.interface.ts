interface IProject {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  userId: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
