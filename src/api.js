//const { TaskItem, Task, User } = require('./tables.js');
const { TaskItem, Task, User } = require('./mongodb.js');
const { ipcMain } = require('electron');
const { ObjectId } = require('mongodb');
let passwordHash = require('password-hash');
const getObjectIdByRawId = (rawId) => {
    if (rawId == null) return null;
    const bufferArray = Object.values(rawId.buffer);
    const buffer = Buffer.from(bufferArray);
    const hexString = buffer.toString('hex');
    const PreparedIdObjectId = new ObjectId(hexString);
    return PreparedIdObjectId;
}
/* taskitems */
ipcMain.handle('get-taskItemById', async (event, _id) => {
    try {
        _id = getObjectIdByRawId(_id);
        const taskItems = await TaskItem.find({
            _id: _id,
        });
        return taskItems;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('get-taskItemsByParentId', async (event, userId, parentId) => {
    userId = getObjectIdByRawId(userId);
    parentId = parentId !== null ? getObjectIdByRawId(parentId) : null;
    try {
        const taskItems = await TaskItem.find({
            parentId: parentId,
            userId: userId,
        });
        return taskItems;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('add-taskItem', async (event, userId, title, type, parentId) => {
    try {
        userId = getObjectIdByRawId(userId);
        parentId = parentId !== null ? getObjectIdByRawId(parentId) : null;
        const taskItem = await TaskItem.create({ userId, title, type, parentId });
        console.log("taskItem " + title + " created successfully")
        return taskItem;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('delete-taskItem', async (event, taskItemId) => {
    try {
        taskItemId = getObjectIdByRawId(taskItemId);
        await deleteTaskItemAndChildren(taskItemId);
        return true;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
async function deleteTaskItemAndChildren(taskItemId) {
    try {

        await Task.deleteMany({ tasklistId: taskItemId });
        const childTaskItems = await TaskItem.find({ parentId: taskItemId });
        for (const childTaskItem of childTaskItems) {
            await deleteTaskItemAndChildren(childTaskItem._id);
        }
        await TaskItem.deleteOne({ _id: taskItemId });
    } catch (error) {
        console.log(error);
        return { error: error.message }
    }
}
ipcMain.handle('update-taskItem', async (event, taskItemId, taskItemTitle) => {
    try {
        taskItemId = getObjectIdByRawId(taskItemId);
        await TaskItem.findByIdAndUpdate(
            taskItemId,
            {
                title: taskItemTitle
            }
        );
        return true;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('search_taskitems', async (event, searchQuery) => {
    try {
        if (!searchQuery.trim()) {
            return []; // Или вернуть все документы, если это ожидаемо
        }
        // Экранирование специальных символов
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedQuery, 'i');

        const taskItems = await TaskItem.find({
            $or: [
                { title: regex },
                { type: regex },
            ],
        });
        return taskItems;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
})
/* tasks */
ipcMain.handle('add-task', async (event, newTask) => {
    console.log("start adding task");
    console.log(newTask);
    try {
        const tasklistId = getObjectIdByRawId(newTask.tasklistId);
        console.log(tasklistId);
        const task = await Task.create({
            title: newTask.title,
            type: newTask.type,
            priority: newTask.priority,
            tasklistId: tasklistId,
            dateOfStart: newTask.dateOfStart,
            dateOfEnd: newTask.dateOfEnd,
            needToComplete: newTask.needToComplete,
        });
        console.log(task);
        console.log("end adding task");

        return task;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('get-tasks', async (event, tasklistId) => {
    try {
        tasklistId = getObjectIdByRawId(tasklistId);
        const tasks = await Task.find({
            tasklistId: tasklistId
        });
        return tasks;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('edit-task', async (event, taskToEdit) => {
    try {
        console.log("start edit task");

        const taskToEditId = getObjectIdByRawId(taskToEdit.id);
        console.log(taskToEdit);
        console.log(taskToEditId);

        const task = await Task.findByIdAndUpdate(
            taskToEditId,
            {
                $set: {
                    title: taskToEdit.title,
                    type: taskToEdit.type,
                    priority: taskToEdit.priority,
                    dateOfEnd: taskToEdit.dateOfEnd,
                    needToComplete: taskToEdit.needToComplete,
                }
            },
        );
        console.log("end edit task");
        return task;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('delete-task', async (event, taskId) => {
    try {
        taskId = getObjectIdByRawId(taskId);
        const task = await Task.deleteOne(
            {
                _id: taskId
            }
        );
        return task;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('change-task-status', async (event, taskId, newStatus) => {
    try {
        console.log("start changing status");
        taskId = getObjectIdByRawId(taskId);
        console.log(taskId);
        console.log(newStatus);
        const tasks = await Task.findByIdAndUpdate(
            taskId,
            { $set: { status: newStatus } }
        );
        console.log(tasks);

        return tasks;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('change-task-complete-already', async (event, taskId, completeAlready) => {
    try {
        taskId = getObjectIdByRawId(taskId);
        const tasks = await Task.findByIdAndUpdate(
            taskId,
            { $set: { completeAlready: completeAlready } }
        );
        return tasks;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('get-completed-percent', async (event, taskItemId) => {
    try {
        taskItemId = getObjectIdByRawId(taskItemId);
        const tasks = await Task.find({
            tasklistId: taskItemId
        }
        );
        if (tasks.length === 0) {
            return 0;
        }
        const completed = tasks.filter(task => task.status == true);
        const completedPercent = (completed.length / tasks.length) * 100;
        return completedPercent;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
ipcMain.handle('get-items-from-parent', async (event, taskItemId) => {
    try {
        taskItemId = getObjectIdByRawId(taskItemId);
        const item = await TaskItem.findOne({ _id: taskItemId });
        let items;
        if (item.type == "catalog") {
            items = await TaskItem.find({
                parentId: taskItemId
            },
                {},
                { limit: 2 }
            );
        } else {
            items = await Task.find(
                { tasklistId: taskItemId },
                {},
                {
                    limit: 2
                }
            );
        }
        return items;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});


/* users */
ipcMain.handle('register-user', async (event, username, email, password) => {
    try {
        hashedPassword = passwordHash.generate(password);
        await User.create({ username, email, password: hashedPassword });
        return true;
    } catch (error) {
        console.log(error);
        return [error, username, email];
    }
});
ipcMain.handle('login-user', async (event, email, password) => {
    try {
        const user = await User.findOne({
            email: email
        });
        if (passwordHash.verify(password, user.password)) {
            return user;
        } else {
            console.log("failure");
            return false;
        }
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});