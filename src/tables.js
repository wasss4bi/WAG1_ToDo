import sqlite3 from "sqlite3";
const path = require('node:path');
const { Sequelize, DataTypes } = require('sequelize');
const dbPath = path.join('D:', 'ITSHNICHNAYA', 'Projects', 'Electron', 'bambam', 'src', 'database.sqlite');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: sqlite3,
    /* storage: path.join(__dirname, '../../src/database.sqlite'), */
    storage: dbPath,
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection success.');
    })
    .catch(err => {
        console.error('Connection error', err);
    });
const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: false
});
const TaskItems = sequelize.define('taskItems', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: false,
});
const Tasks = sequelize.define('tasks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tasklistId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /* 
    1 - На раз
    2 - На количество (XX/XX)
    */
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    completeAlready: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    needToComplete: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
    /* 
    1 - A( Очень важная )
    2 - B( Второстепенная )
    3 - C( Может подождать )
    */
    priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    dateOfStart: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfEnd: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfComplete: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
});
sequelize.sync();



export { sequelize, Tasks, TaskItems, Users };