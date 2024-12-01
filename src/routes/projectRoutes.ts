import express from 'express';
import {
  getProjectsController,
  getSortedProjectsController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/projectController';
import { createUpdateProjectSchema, validateSchema } from '../validations';

const router = express.Router();

/**
 * @route GET /projects
 * @description Fetch all projects
 * @access Public
 */
router.get('/', getProjectsController);

/**
 * @route GET /projects/sort
 * @description Fetch projects sorted by the specified field and order
 * @query {string} sortField - The field to sort by (e.g., startDate, endDate)
 * @query {string} sortOrder - The sort order ('asc' or 'desc')
 * @access Public
 */
router.get('/sort', getSortedProjectsController);

/**
 * @route POST /projects
 * @description Create a new project
 * @body {object} projectData - The project details (name, description, startDate, endDate)
 * @access Public
 */
router.post(
  '/',
  validateSchema(createUpdateProjectSchema),
  createProjectController,
);

/**
 * @route PUT /projects/:id
 * @description Update an existing project
 * @param {string} id - The ID of the project to update
 * @body {object} projectData - The updated project details
 * @access Public
 */
router.put(
  '/:id',
  validateSchema(createUpdateProjectSchema),
  updateProjectController,
);

/**
 * @route DELETE /projects/:id
 * @description Delete an existing project
 * @param {string} id - The ID of the project to delete
 * @access Public
 */
router.delete('/:id', deleteProjectController);

export default router;
