const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

}, {
    timestamps: false
});
const taskItemSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ссылка на модель User
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskItem', // Ссылка на саму себя (для вложенных элементов)
        required: false,
    },
}, {
    timestamps: false,
});
const taskSchema = new Schema({
    tasklistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskItem', // Ссылка на модель TaskItem
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    /* 
    1 - На раз
    2 - На количество (XX/XX)
    */
    type: {
        type: Number,
        required: false,
    },
    completeAlready: {
        type: Number,
        default: 0,
        required: true,
    },
    needToComplete: {
        type: Number,
        required: false,
    },
    status: {
        type: Boolean,
        default: false,
        required: true,
    },
    /* 
    1 - A( Очень важная )
    2 - B( Второстепенная )
    3 - C( Может подождать )
    */
    priority: {
        type: Number,
        required: true,
    },
    dateOfStart: {
        type: String,
        required: false,
    },
    dateOfEnd: {
        type: String,
        required: true,
    },
    dateOfComplete: {
        type: String,
        required: false,
    },
}, {
    timestamps: false,
});
const User = mongoose.model('User', userSchema);
const TaskItem = mongoose.model('TaskItem', taskItemSchema);
const Task = mongoose.model('Task', taskSchema);
mongoose.connect("mongodb://localhost:27017/wag1_express")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

export { Task, TaskItem, User };