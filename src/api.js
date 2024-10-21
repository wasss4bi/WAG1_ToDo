const { TaskItems, Tasks, Users } = require('./tables.js');
const { ipcMain } = require('electron');
let passwordHash = require('password-hash');
/* taskitems */
ipcMain.handle('get-taskItemById', async (event, id) => {
    console.log(id);
    try {
        const taskItems = await TaskItems.findAll({
            where: {
                id: id,
            }
        });
        return taskItems;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('get-taskItemsByParentId', async (event, userId, parentId) => {
    console.log(parentId);
    try {
        const taskItems = await TaskItems.findAll({
            where: {
                parentId: parentId,
                userId: userId,
            }
        });
        return taskItems;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('add-taskItem', async (event, userId, title, type, parentId) => {
    try {
        const taskItem = await TaskItems.create({ userId, title, type, parentId });
        return taskItem;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('delete-taskItem', async (event, taskItemId) => {
    try {
        await deleteTaskItemAndChildren(taskItemId);
        return true;
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
});
async function deleteTaskItemAndChildren(taskItemId) {
    await Tasks.destroy({
        where: {
            tasklistId: taskItemId
        }
    });
    const childTaskItems = await TaskItems.findAll({
        where: {
            parentId: taskItemId
        }
    });
    for (const childTaskItem of childTaskItems) {
        await deleteTaskItemAndChildren(childTaskItem.id);
    }
    await TaskItems.destroy({
        where: {
            id: taskItemId
        }
    });
}
ipcMain.handle('update-taskItem', async (event, taskItemId, taskItemTitle) => {
    try {
        await TaskItems.update(
            {
                title: taskItemTitle
            },
            {
                where: {
                    id: taskItemId
                }
            },
        );
        return true;
    } catch (error) {
        return { error: error.message };
    }
});


/* tasks */
ipcMain.handle('add-task', async (event, newTask) => {
    console.log(newTask)
    try {
        const task = await Tasks.create({
            title: newTask.title,
            type: newTask.type,
            priority: newTask.priority,
            tasklistId: newTask.tasklistId,
            dateOfStart: newTask.dateOfStart,
            dateOfEnd: newTask.dateOfEnd,
            needToComplete: newTask.needToComplete,
        });
        console.log(task);
        return task;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('get-tasks', async (event, tasklistId) => {
    try {
        const tasks = await Tasks.findAll({
            where: {
                tasklistId: tasklistId
            }
        });
        return tasks;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('edit-task', async (event, taskToEdit) => {
    try {
        const task = await Tasks.update(
            {
                title: taskToEdit.title,
                type: taskToEdit.type,
                priority: taskToEdit.priority,
                dateOfEnd: taskToEdit.dateOfEnd,
                needToComplete: taskToEdit.needToComplete,
            },
            {
                where: {
                    id: taskToEdit.id
                }
            }
        );
        return task;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('delete-task', async (event, taskId) => {
    try {
        const task = await Tasks.destroy(
            {
                where: {
                    id: taskId
                }
            }
        );
        return task;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('change-task-status', async (event, taskId, newStatus) => {
    try {
        const tasks = await Tasks.update(
            { status: newStatus },  // Значения для обновления
            { where: { id: taskId } }
        );
        return tasks;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('change-task-complete-already', async (event, taskId, completeAlready) => {
    try {
        const tasks = await Tasks.update(
            { completeAlready: completeAlready },  // Значения для обновления
            { where: { id: taskId } }
        );
        return tasks;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('get-completed-percent', async (event, taskItemId) => {
    try {
        const tasks = await Tasks.findAll({
            where: { tasklistId: taskItemId }
        });

        if (tasks.length === 0) {
            return 0;
        }

        const completed = tasks.filter(task => task.dataValues.status == true);

        const completedPercent = (completed.length / tasks.length) * 100;

        return completedPercent;
    } catch (error) {
        return { error: error.message };
    }
});
ipcMain.handle('get-items-from-parent', async (event, taskItemId) => {
    try {
        const item = await TaskItems.findOne({ where: { id: taskItemId } });
        let items;
        if (item.dataValues.type == "catalog") {
            items = await TaskItems.findAll({
                where: { parentId: taskItemId },
                limit: 2
            });
        } else {
            items = await Tasks.findAll({
                where: { tasklistId: taskItemId },
                limit: 2
            });
        }
        return items;
    } catch (error) {
        return { error: error.message };
    }
});


/* users */
ipcMain.handle('register-user', async (event, username, email, password) => {
    console.log("bebo");
    try {
        hashedPassword = passwordHash.generate(password);
        console.log({ username, email, password: hashedPassword });
        await Users.create({ username, email, password: hashedPassword });
        return true;
    } catch (error) {
        return [error, username, email, password, hashedPassword];
    }
});
ipcMain.handle('login-user', async (event, email, password) => {
    try {
        const user = await Users.findOne({
            where: { email: email }
        });
        console.log(user.dataValues);
        if (passwordHash.verify(password, user.dataValues.password)) {
            console.log(["success", passwordHash.verify(password, user.dataValues.password), password, user.dataValues.password, email]);
            return user;
        } else {
            console.log("failure");
            return false;
        }
    } catch (error) {
        return { error: error.message };
    }
});