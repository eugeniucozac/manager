import { ObjectId } from 'mongodb';
import { db } from '../db';
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from '../models/Task';

/**
 * Retrieves tasks from the database, optionally filtered by status.
 * @param status - The status of tasks to filter by (e.g., "TODO" or "DONE").
 * @returns {Promise<Task[]>} An array of tasks.
 */
export const getTasks = async (status?: string) => {
  const filter = status ? { status } : {};
  return await db.collection('tasks').find(filter).toArray();
};

/**
 * Retrieves tasks sorted by a specific field and order.
 * @param sortField - The field to sort tasks by (e.g., 'startDate', 'dueDate').
 * @param sortOrder - The order to sort tasks in, 1 for ascending and -1 for descending.
 * @returns {Promise<Task[]>} An array of sorted tasks.
 */
export const getSortedTasks = async (sortField: string, sortOrder: any) => {
  return await db
    .collection('tasks')
    .find({})
    .sort({ [sortField]: sortOrder })
    .toArray();
};

/**
 * Searches for tasks by name, using a case-insensitive regex match.
 * @param name - The name or part of the name to search for.
 * @returns {Promise<Task[]>} An array of matching tasks.
 */
export const searchTasks = async (name: string) => {
  return await db
    .collection('tasks')
    .find({ name: { $regex: name, $options: 'i' } })
    .toArray();
};

/**
 * Retrieves tasks associated with a specific project by project name.
 * @param projectName - The name of the project to filter tasks by.
 * @throws {Error} If the project is not found.
 * @returns {Promise<Task[]>} An array of tasks linked to the project.
 */
export const filterTasksByProject = async (projectName: string) => {
  const project = await db
    .collection('projects')
    .findOne({ name: { $regex: projectName, $options: 'i' } });
  if (!project) throw new Error('Project not found');
  return await db
    .collection('tasks')
    .find({ projectId: project._id })
    .toArray();
};

/**
 * Creates a new task in the database, ensuring no duplicate task name exists.
 * @param taskData - The data for the task to be created.
 * @throws {Error} If a task with the same name already exists.
 * @returns {Promise<ObjectId>} The ID of the created task.
 */
export const createTask = async (taskData: CreateTaskDto) => {
  const existingTask = await db
    .collection('tasks')
    .findOne({ name: taskData.name });

  if (existingTask) {
    throw new Error(`A task with the name "${taskData.name}" already exists.`);
  }

  const taskToInsert = {
    ...taskData,
    status: TaskStatus.TODO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('tasks').insertOne(taskToInsert);
  return result.insertedId;
};

/**
 * Updates an existing task in the database.
 * Ensures no duplicate task name exists before updating.
 * @param id - The ID of the task to update.
 * @param updateData - The data to update the task with.
 * @throws {Error} If the ID is invalid or if a duplicate task name exists.
 * @returns {Promise<number>} The number of documents modified.
 */
export const updateTask = async (id: string, updateData: UpdateTaskDto) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid Task ID');
  const existingTask = await db
    .collection('tasks')
    .findOne({ name: updateData.name });

  if (existingTask) {
    throw new Error(
      `A task with the name "${updateData.name}" already exists.`,
    );
  }

  const taskId = new ObjectId(id);
  const cleanedData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined),
  );
  const result = await db
    .collection('tasks')
    .updateOne({ _id: taskId }, { $set: cleanedData });
  return result.modifiedCount;
};

/**
 * Deletes a task from the database by its ID.
 * @param id - The ID of the task to delete.
 * @throws {Error} If the ID is invalid.
 * @returns {Promise<number>} The number of documents deleted.
 */
export const deleteTask = async (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid Task ID');
  const taskId = new ObjectId(id);
  const result = await db.collection('tasks').deleteOne({ _id: taskId });
  return result.deletedCount;
};

/**
 * Updates the status of a task and modifies relevant timestamps.
 * - If status is "DONE", sets the `doneDate` to the current date.
 * - If status is "TODO", sets the `startDate` to the current date.
 * @param id - The ID of the task to update.
 * @param status - The new status of the task ("TODO" or "DONE").
 * @throws {Error} If the ID is invalid.
 * @returns {Promise<number>} The number of documents modified.
 */
export const updateTaskStatus = async (id: string, status: any) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid Task ID');
  const taskId = new ObjectId(id);
  const updateData: Partial<Task> = { status, updatedAt: new Date() };
  if (status === 'DONE') updateData.doneDate = new Date();
  if (status === 'TODO') updateData.startDate = new Date();
  const result = await db
    .collection('tasks')
    .updateOne({ _id: taskId }, { $set: updateData });
  return result.modifiedCount;
};

/**
 * Assigns a task to a specific project by their IDs.
 * Validates both the task and project IDs and checks if the project exists.
 * @param taskId - The ID of the task to assign.
 * @param projectId - The ID of the project to assign the task to.
 * @throws {Error} If either ID is invalid or if the project is not found.
 * @returns {Promise<number>} The number of documents matched.
 */
export const assignTaskToProject = async (
  taskId: string,
  projectId: string,
) => {
  if (!ObjectId.isValid(projectId)) throw new Error('Invalid Project ID');
  if (!ObjectId.isValid(taskId)) throw new Error('Invalid Task ID');
  const taskObjectId = new ObjectId(taskId);
  const projectObjectId = new ObjectId(projectId);
  const projectExists = await db
    .collection('projects')
    .findOne({ _id: projectObjectId });
  if (!projectExists) throw new Error('Project not found');
  const result = await db
    .collection('tasks')
    .updateOne({ _id: taskObjectId }, { $set: { projectId: projectObjectId } });
  return result.matchedCount;
};
