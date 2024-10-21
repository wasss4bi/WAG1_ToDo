import React, { useState, useEffect } from 'react';
import {Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import rightArrow from "../img/right-arrow.png";
function RightMenu({ setRightWidth, setCenterWidth, rightWidth, addNewTaskToCenter, taskList, taskToEdit }) {
    const today = new Date().toISOString().split('T')[0];
    const [taskName, setTaskName] = useState();
    const [taskType, setTaskType] = useState(1);
    const [taskPriority, setTaskPriority] = useState(1);
    const [taskDeadline, setTaskDeadline] = useState(today);
    const [taskNeedToComplete, setTaskNeedToComplete] = useState(0);
    const closeRightMenu = () => {
        setRightWidth(0);
        setCenterWidth(9);
        setTaskName(null);
        setTaskType(1);
        setTaskPriority(1);
        setTaskDeadline(today);
        setTaskNeedToComplete(null);
    }
    const addTask = async () => {
        try {
            let newTask = {
                title: taskName,
                type: taskType,
                priority: taskPriority,
                tasklistId: taskList.id,
                dateOfStart: today,
                dateOfEnd: taskDeadline,
                needToComplete: taskNeedToComplete,
            }
            await window.electronAPI.addTask(newTask);
        } catch (error) {
            console.log(error);
        };
        closeRightMenu();
        addNewTaskToCenter(true);
    }
    const deleteTask = async (taskId) => {
        try {
            await window.electronAPI.deleteTask(taskId);
        } catch (error) {
            console.log(error);
        };
        closeRightMenu();
        addNewTaskToCenter(true);
    }
    useEffect(() => {
        if (taskToEdit) {
            setTaskName(taskToEdit.title);
            setTaskType(taskToEdit.type);
            setTaskPriority(taskToEdit.priority);
            setTaskDeadline(taskToEdit.dateOfEnd);
            setTaskNeedToComplete(taskToEdit.needToComplete);
        }
    }, [taskToEdit])
    const editTask = async () => {
        try {
            let editingTask = {
                id: taskToEdit.id,
                title: taskName,
                type: taskType,
                priority: taskPriority,
                tasklistId: taskList.id,
                dateOfStart: today,
                dateOfEnd: taskDeadline,
                needToComplete: taskNeedToComplete,
            }
            await window.electronAPI.editTask(editingTask);
        } catch (error) {
            console.log(error);
        };
        closeRightMenu();
        addNewTaskToCenter(true);
    }
    return (
        <Col className={"custom-darker p-0 " + (rightWidth == 0 ? "d-none" : null)} sm={rightWidth}>
            <div className="menu-header custom-grey d-flex justify-content-between p-3  align-items-center">
                <button className="d-flex border-0 hover h-100 btn-img" onClick={closeRightMenu}>
                    <img src={rightArrow} alt="" />
                </button>
                <div className="fs-3 text-white d-flex h-100 align-items-center me-5">{taskToEdit ? "Редактировать задачу" : "Добавить задачу"}</div>
            </div>
            <div className="menu-content custom-darker px-3 m-0">
                <label htmlFor="task-name" className="form-label mt-3">Название задачи</label>
                <input type="text" className="form-control" id="task-name" value={taskName || ""} onChange={(e) => { setTaskName(e.target.value); }} />

                <label htmlFor="task-type" className="form-label mt-3">Тип задачи</label>
                <select className="form-select form-select-lg" value={taskType || null} id="task-type" onChange={(e) => { setTaskType(e.target.value); setTaskNeedToComplete(0); }}>
                    <option value="1">На раз</option>
                    <option value="2">На количество (XX/XX)</option>
                </select>

                {taskType == 2 ? (
                    <div>
                        <label htmlFor="task-needToComplete" className="form-label mt-3">Количество, которое нужно выполнить</label>
                        <input type="number" className="form-control" value={taskNeedToComplete} id="task-needToComplete" onChange={(e) => { setTaskNeedToComplete(e.target.value); }} />
                    </div>
                ) : null}

                <label htmlFor="task-priority" className="form-label mt-3">Приоритет</label>
                <select className="form-select form-select-lg" value={taskPriority || null} id="task-priority" onChange={(e) => { setTaskPriority(e.target.value); }}>
                    <option value="1">A ( Очень важная )</option>
                    <option value="2">B ( Второстепенная )</option>
                    <option value="3">C ( Может подождать )</option>
                </select>

                <label htmlFor="task-deadline" className="form-label mt-3">Дедлайн</label>
                <input type="date" className="form-control" id="task-deadline" min={today} value={taskDeadline} onChange={(e) => { setTaskDeadline(e.target.value); console.log(e.target.value); }} />
                <div className="d-flex ">
                    <Button className='d-flex mt-4 me-2 px-1' onClick={taskToEdit ? editTask : addTask}>{taskToEdit ? "Редактировать задачу" : "Добавить задачу"}</Button>
                    {taskToEdit && (
                        <Button className='d-flex mt-4 ms-2 btn-danger px-1' onClick={() => { deleteTask(taskToEdit.id); closeRightMenu(); addNewTaskToCenter(true); }}>Удалить задачу</Button>
                    )}
                </div>
            </div>
        </Col>
    )
}

export {RightMenu}