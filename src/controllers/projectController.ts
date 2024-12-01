import { Request, Response } from 'express';
import * as projectService from '../services/projectService';

/**
 * Controller to fetch all projects.
 * Retrieves all projects from the database and sends them as a JSON response.
 * Handles any errors that occur during retrieval.
 */
export const getProjectsController = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getProjects();
    res.json(projects);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to fetch sorted projects.
 * Retrieves projects from the database sorted by the specified field and order.
 * Handles validation for sort field and sort order and responds with sorted projects.
 */
export const getSortedProjectsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const sortField = req.query.sortField as string;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const projects = await projectService.getSortedProjects(
      sortField,
      sortOrder,
    );
    res.json(projects);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to create a new project.
 * Validates the request body, creates a project in the database, and returns the project ID.
 * Handles duplicate project name errors and other exceptions.
 */
export const createProjectController = async (req: Request, res: Response) => {
  try {
    const projectId = await projectService.createProject(req.body);
    res
      .status(201)
      .json({ message: 'Project created successfully', projectId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to update an existing project.
 * Finds a project by ID and updates it with the data provided in the request body.
 * Responds with an appropriate message if the project is not found or successfully updated.
 */
export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const modifiedCount = await projectService.updateProject(
      req.params.id,
      req.body,
    );
    if (!modifiedCount)
      return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project updated successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to delete a project.
 * Deletes a project by ID and unlinks associated tasks (sets their projectId to null).
 * Responds with a message if the project is not found or successfully deleted.
 */
export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const deletedCount = await projectService.deleteProject(req.params.id);
    if (!deletedCount)
      return res.status(404).json({ message: 'Project not found' });
    res.json({
      message: 'Project deleted successfully and associated tasks unlinked',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
