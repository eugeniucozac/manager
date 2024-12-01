import { ObjectId } from 'mongodb';

export interface Project {
  _id?: ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectDto = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>;

export type UpdateProjectDto = Partial<Omit<Project, '_id' | 'createdAt'>> & {
  updatedAt: Date;
};
