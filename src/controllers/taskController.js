const TasK = require("../models/taskModel.js");
const { errorRes } = require("../utils/responses.js");

// Create Task data function
exports.createTask = async (req, res) => {
    try {
        const { title, description = "", status, priority, due_date } = req.body;

        const checkTitle = await TasK.exists({ title });
        if (checkTitle) {
            return res.status(409).json({ success: false, message: `Task with title '${title}' already exists, please used another title` });
        }

        const task = await TasK.create({ title, description, status, priority, due_date });
        if (!task) {
            return res.status(400).json({ success: false, message: `can't create Task..!` });
        }

        return res.status(201).json({ success: true, message: "successfully create data", data: task || {} });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Task List function
exports.listTaskAll = async (req, res) => {
    try {
        const list = await TasK.find();
        return res.status(200).json({ success: true, message: "retriving task list", data: list || [] });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Task list With Pagination wise
exports.listOfTasks = async (req, res) => {
    try {
        let { page, limit, search = "" } = req.query;
        page = Number(page);
        if (!page || isNaN(page)) return res.status(400).json({ success: false, message: "please enter valid page number" });
        limit = Number(limit);
        if (!limit || isNaN(limit)) return res.status(400).json({ success: false, message: "please enter valid limit" });

        const filter = {};
        if (search?.trim()?.length) {
            filter.$or = [
                { title: { $regex: search, option: "i" } },
                { description: { $regex: search, option: "i" } },
                { status: { $regex: search, option: "i" } }
            ];
        }

        const [
            totalCount,
            listData
        ] = await Promise.all([
            TasK.countDocuments(filter),
            TasK.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })
        ]);

        const totalPage = Math.ceil(totalCount / limit);
        const hasNext = page < totalPage;
        const hasPrevious = page > 1;

        return res.status(200).json({
            success: true,
            message: "successfully retriving data",
            totaldata: totalCount || 0,
            pagination: {
                limit,
                hasPrevious,
                page,
                hasNext
            },
            data: listData || []
        });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Task Get By Their ID
exports.TaskById = async (req, res) => {
    try {
        const { _id } = req.params;
        const task = await TasK.findById(_id);

        return res.status(200).json({ success: true, message: "retriving data successfully", data: task || {} });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Update Task one base on their ID function
exports.updateTask = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id?.length) return res.status(400).json({ success: false, message: "please provide valid task ID" });

        const existTask = await TasK.findById(_id);
        if (!existTask) {
            return res.status(400).json({ success: false, message: "can't find task with this ID" });
        }

        if (req.body?.title) {
            const checkTitle = await TasK.exists({ title: req.body.title, _id: { $ne: _id } });
            if (checkTitle) {
                return res.status(400).json({ success: false, message: `Task with title '${req.body?.title}' already exist, please used another title` });
            }
        }

        const updateTask = await TasK.findByIdAndUpdate(
            _id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Data update successfully",
            data: updateTask
        });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Update Multiple Task Data
exports.updateManyTask = async (req, res) => {
    try {
        const { taskids, updateData } = req.body;
        if (!taskids?.length) return res.status(400).json({ success: false, message: "please enter any valid task ID" });
        if (updateData && !Object.keys(updateData)?.length) return res.status(400).json({ success: false, message: "please enter any valid updated data" })

        const result = await TasK.updateMany(
            { _id: { $in: taskids } },
            { $set: updateData }
        );

        return res.status(200).json({
            success: true,
            message: "update successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Delete Task Data
exports.deleteTask = async (req, res) => {
    try {
        const { _id } = req.params;
        const checkData = await TasK.findById(_id);
        if (!checkData) return res.status(400).json({ success: false, message: "can't found data with this id" });

        const deleteData = await TasK.findByIdAndDelete(_id);
        return res.status(200).json({ success: true, message: "delete successfully", data: deleteData });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};

// Delete Many Task By id
exports.deleteManyTask = async (req, res) => {
    try {
        const { taskids } = req.body;
        if (!taskids?.length) return res.status(400).json({ success: false, message: "please enter valid ids" });

        const deleted = await TasK.deleteMany({ _id: { $in: taskids } });
        if (deleted?.deletedCount === 0) return res.status(404).json({ success: false, message: "can't found data by ids" });

        return res.status(200).json({
            success: true,
            message: "Tasks deleted successfully",
            deletedCount: deleted.deletedCount
        });
    } catch (error) {
        errorRes(res, 500, error?.message);
    }
};