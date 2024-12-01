import { ObjectId } from 'mongodb';
import { db } from '../db';
import { CreateProjectDto, UpdateProjectDto } from '../models/Project';

/**
 * Retrieves all projects from the database.
 * @returns {Promise<any[]>} An array of all projects.
 */
export const getProjects = async () => {
  return await db.collection('projects').find({}).toArray();
};

/**
 * Retrieves all projects sorted by a specified field and order.
 * @param sortField - The field by which to sort (e.g., 'startDate', 'endDate').
 * @param sortOrder - The sort order, 1 for ascending and -1 for descending.
 * @returns {Promise<any[]>} An array of sorted projects.
 */
export const getSortedProjects = async (sortField: string, sortOrder: any) => {
  return await db
    .collection('projects')
    .find({})
    .sort({ [sortField]: sortOrder })
    .toArray();
};

/**
 * Creates a new project in the database.
 * Ensures no duplicate project name exists before inserting.
 * @param projectData - The data for the project to be created.
 * @throws {Error} If a project with the same name already exists.
 * @returns {Promise<ObjectId>} The ID of the created project.
 */
export const createProject = async (projectData: CreateProjectDto) => {
  const existingProject = await db
    .collection('projects')
    .findOne({ name: projectData.name });

  if (existingProject) {
    throw new Error(
      `A project with the name "${projectData.name}" already exists.`,
    );
  }

  const projectToInsert = {
    ...projectData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection('projects').insertOne(projectToInsert);
  return result.insertedId;
};

/**
 * Updates an existing project in the database.
 * Ensures no duplicate project name exists before updating.
 * @param id - The ID of the project to update.
 * @param updateData - The data to update the project with.
 * @throws {Error} If the ID is invalid or if a duplicate project name exists.
 * @returns {Promise<number>} The number of documents modified.
 */
export const updateProject = async (
  id: string,
  updateData: UpdateProjectDto,
) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid Project ID');

  const existingProject = await db
    .collection('projects')
    .findOne({ name: updateData.name });

  if (existingProject) {
    throw new Error(
      `A project with the name "${updateData.name}" already exists.`,
    );
  }

  const projectId = new ObjectId(id);
  const cleanedUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined),
  );
  const result = await db
    .collection('projects')
    .updateOne({ _id: projectId }, { $set: cleanedUpdateData });
  return result.modifiedCount;
};

/**
 * Deletes a project from the database and unlinks all associated tasks.
 * - Removes the project document.
 * - Unsets the `projectId` field in all tasks linked to the project.
 * @param id - The ID of the project to delete.
 * @throws {Error} If the ID is invalid.
 * @returns {Promise<number>} The number of documents deleted.
 */
export const deleteProject = async (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid Project ID');
  const projectId = new ObjectId(id);

  const projectResult = await db
    .collection('projects')
    .deleteOne({ _id: projectId });

  if (projectResult.deletedCount) {
    await db
      .collection('tasks')
      .updateMany({ projectId: projectId }, { $unset: { projectId: '' } });
  }

  return projectResult.deletedCount;
};
