interface IWorkExperince {
  id: number;
  companyName: string;
  role: string;
  descreption: string;
  userId: number;
  user: IUser;
  startDate: Date;
  endDate: Date;
}
