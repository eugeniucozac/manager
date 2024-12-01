import { ObjectId } from 'mongodb';

export interface Task {
  _id?: ObjectId;
  name: string;
  status: TaskStatus;
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  doneDate?: Date;
  projectId?: ObjectId;
}

export enum TaskStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

export type CreateTaskDto = Omit<
  Task,
  '_id' | 'createdAt' | 'updatedAt' | 'doneDate'
>;

export type UpdateTaskDto = Partial<Omit<Task, '_id' | 'createdAt'>> & {
  updatedAt: Date;
};
