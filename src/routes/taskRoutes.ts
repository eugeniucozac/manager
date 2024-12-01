import express from 'express';
import {
  getTasksController,
  getSortedTasksController,
  searchTasksController,
  filterTasksByProjectController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
  updateTaskStatusController,
  assignTaskToProjectController,
} from '../controllers/taskController';
import {
  validateSchema,
  createTaskSchema,
  updateTaskSchema,
} from '../validations';

const router = express.Router();

/**
 * @route GET /tasks
 * @description Fetch all tasks, optionally filtered by status
 * @query {string} status - Optional query to filter tasks by status ('TODO' or 'DONE')
 * @access Public
 */
router.get('/', getTasksController);

/**
 * @route GET /tasks/sort
 * @description Fetch tasks sorted by a specified field
 * @query {string} sortField - Field to sort by (e.g., startDate, dueDate, doneDate)
 * @query {string} sortOrder - Sort order ('asc' or 'desc')
 * @access Public
 */
router.get('/sort', getSortedTasksController);

/**
 * @route GET /tasks/search
 * @description Search tasks by name
 * @query {string} name - Name (or part of the name) to search for
 * @access Public
 */
router.get('/search', searchTasksController);

/**
 * @route GET /tasks/filter
 * @description Fetch tasks associated with a specific project
 * @query {string} projectName - Name of the project to filter tasks by
 * @access Public
 */
router.get('/filter', filterTasksByProjectController);

/**
 * @route POST /tasks
 * @description Create a new task
 * @body {object} taskData - Task details (name, startDate, dueDate, status)
 * @access Public
 */
router.post('/', validateSchema(createTaskSchema), createTaskController);

/**
 * @route PUT /tasks/:id
 * @description Update an existing task
 * @param {string} id - ID of the task to update
 * @body {object} taskData - Updated task details
 * @access Public
 */
router.put('/:id', validateSchema(updateTaskSchema), updateTaskController);

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID
 * @param {string} id - ID of the task to delete
 * @access Public
 */
router.delete('/:id', deleteTaskController);

/**
 * @route PATCH /tasks/:id/status
 * @description Update the status of a task (e.g., from TODO to DONE)
 * @param {string} id - ID of the task to update
 * @body {string} status - New status ('TODO' or 'DONE')
 * @access Public
 */
router.patch('/:id/status', updateTaskStatusController);

/**
 * @route PATCH /tasks/:taskId/project/:projectId
 * @description Assign a task to a project
 * @param {string} taskId - ID of the task to assign
 * @param {string} projectId - ID of the project to assign the task to
 * @access Public
 */
router.patch('/:taskId/project/:projectId', assignTaskToProjectController);

export default router;
