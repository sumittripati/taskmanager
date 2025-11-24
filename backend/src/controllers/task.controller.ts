import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskStatus } from '@prisma/client';

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'OPEN',
                userId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status as TaskStatus;
        const search = req.query.search as string;

        const where: any = { userId };

        if (status) {
            where.status = status;
        }

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.task.count({ where }),
        ]);

        res.json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { title, description, status } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const existingTask = await prisma.task.findUnique({ where: { id } });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const task = await prisma.task.update({
            where: { id },
            data: { title, description, status },
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const existingTask = await prisma.task.findUnique({ where: { id } });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.task.delete({ where: { id } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const existingTask = await prisma.task.findUnique({ where: { id } });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newStatus = existingTask.status === 'DONE' ? 'OPEN' : 'DONE';

        const task = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
