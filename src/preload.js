// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addTaskItem: (userId, title, type, parentId) => ipcRenderer.invoke('add-taskItem', userId, title, type, parentId),
  getTaskItemById: (id) => ipcRenderer.invoke('get-taskItemById', id),
  getTaskItemsByParentId: (userId, parentId) => ipcRenderer.invoke('get-taskItemsByParentId', userId, parentId),
  deleteTaskItem: (taskItemId) => ipcRenderer.invoke('delete-taskItem', taskItemId),
  updateTaskItem: (taskItemId, taskItemTitle) => ipcRenderer.invoke('update-taskItem', taskItemId, taskItemTitle),
  
  addTask: (newTask) => ipcRenderer.invoke('add-task', newTask),
  getTasks: (tasklistId) => ipcRenderer.invoke('get-tasks', tasklistId),
  editTask: (taskToEdit) => ipcRenderer.invoke('edit-task', taskToEdit),
  deleteTask: (taskId) => ipcRenderer.invoke('delete-task', taskId),
  changeTaskStatus: (taskId, newStatus) => ipcRenderer.invoke('change-task-status', taskId, newStatus),
  changeTaskCompleteAlready: (taskId, completeAlready) => ipcRenderer.invoke('change-task-complete-already', taskId, completeAlready),
  getCompletedPercent: (taskItemId) => ipcRenderer.invoke('get-completed-percent', taskItemId),
  getItemsFromParent: (taskItemId) => ipcRenderer.invoke('get-items-from-parent', taskItemId),

  registerUser: (username, email, password) => ipcRenderer.invoke('register-user', username, email, password),
  loginUser: (email, password) => ipcRenderer.invoke('login-user', email, password)
});