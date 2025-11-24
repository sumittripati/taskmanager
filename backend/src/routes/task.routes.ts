import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, toggleTask,} from '../controllers/task.controller';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
