import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

/**
 * Controller to fetch tasks.
 * Supports optional filtering by status.
 * @param req - Express request object with optional `status` query parameter.
 * @param res - Express response object to send the list of tasks.
 */
export const getTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.query.status as string);
    res.json(tasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to fetch tasks sorted by a specific field and order.
 * @param req - Express request object with `sortField` and `sortOrder` query parameters.
 * @param res - Express response object to send the sorted list of tasks.
 */
export const getSortedTasksController = async (req: Request, res: Response) => {
  try {
    const sortField = req.query.sortField as string;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const tasks = await taskService.getSortedTasks(sortField, sortOrder);
    res.json(tasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to search tasks by name.
 * Performs case-insensitive search using regex.
 * @param req - Express request object with `name` query parameter.
 * @param res - Express response object to send the search results.
 */
export const searchTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.searchTasks(req.query.name as string);
    res.json(tasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to filter tasks by project name.
 * @param req - Express request object with `projectName` query parameter.
 * @param res - Express response object to send the filtered tasks.
 */
export const filterTasksByProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const tasks = await taskService.filterTasksByProject(
      req.query.projectName as string,
    );
    res.json(tasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to create a new task.
 * Validates against duplicate tasks and default status to `TODO`.
 * @param req - Express request object containing task details in the body.
 * @param res - Express response object with the created task ID.
 */
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const taskId = await taskService.createTask(req.body);
    res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to update an existing task.
 * Updates only provided fields, leaving others unchanged.
 * @param req - Express request object with task ID in the params and update data in the body.
 * @param res - Express response object with the number of modified fields.
 */
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const modifiedCount = await taskService.updateTask(req.params.id, req.body);
    res.json({ message: 'Task updated successfully', modifiedCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to delete a task by ID.
 * @param req - Express request object with task ID in the params.
 * @param res - Express response object with the deletion result.
 */
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const deletedCount = await taskService.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully', deletedCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to update the status of a task.
 * Handles automatic updates of `startDate` and `doneDate` based on status.
 * @param req - Express request object with task ID in the params and new status in the body.
 * @param res - Express response object with the updated task status.
 */
export const updateTaskStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const modifiedCount = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status,
    );
    res.json({ message: 'Task status updated successfully', modifiedCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller to assign a task to a specific project.
 * Verifies task and project existence before assignment.
 * @param req - Express request object with `taskId` and `projectId` in the params.
 * @param res - Express response object indicating the assignment result.
 */
export const assignTaskToProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const matchedCount = await taskService.assignTaskToProject(
      req.params.taskId,
      req.params.projectId,
    );
    if (!matchedCount)
      return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task assigned to project successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
