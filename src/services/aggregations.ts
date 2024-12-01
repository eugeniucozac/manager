import { connectToDB, db, disconnectDB } from '../db';

/**
 * Runs MongoDB aggregations to fetch:
 * 1. Projects that have tasks with a due date set to "today".
 * 2. Tasks that belong to projects with a due date set to "today".
 */
const runAggregations = async () => {
  try {
    await connectToDB();

    console.log('Running aggregation a: Projects with tasks due today');
    const projectsWithTasksDueToday = await db
      .collection('projects')
      .aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'projectId',
            as: 'tasks',
          },
        },
        {
          $match: {
            'tasks.dueDate': {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
      ])
      .toArray();
    console.log('Projects with tasks due today:', projectsWithTasksDueToday);

    console.log('Running aggregation b: Tasks with projects due today');
    const tasksWithProjectsDueToday = await db
      .collection('tasks')
      .aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.dueDate': {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
      ])
      .toArray();
    console.log('Tasks with projects due today:', tasksWithProjectsDueToday);
  } catch (error) {
    console.error('Error running aggregations:', error);
  } finally {
    await disconnectDB();
  }
};

runAggregations();
