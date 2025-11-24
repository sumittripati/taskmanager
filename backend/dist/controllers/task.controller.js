"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const task = yield prisma_1.default.task.create({
            data: {
                title,
                description,
                status: status || 'OPEN',
                userId,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const search = req.query.search;
        const where = { userId };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }
        const [tasks, total] = yield prisma_1.default.$transaction([
            prisma_1.default.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.task.count({ where }),
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const task = yield prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        const { title, description, status } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const existingTask = yield prisma_1.default.task.findUnique({ where: { id } });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const task = yield prisma_1.default.task.update({
            where: { id },
            data: { title, description, status },
        });
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const existingTask = yield prisma_1.default.task.findUnique({ where: { id } });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        yield prisma_1.default.task.delete({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteTask = deleteTask;
const toggleTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const existingTask = yield prisma_1.default.task.findUnique({ where: { id } });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const newStatus = existingTask.status === 'DONE' ? 'OPEN' : 'DONE';
        const task = yield prisma_1.default.task.update({
            where: { id },
            data: { status: newStatus },
        });
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.toggleTask = toggleTask;
