import React, { useState, useEffect, useContext } from 'react';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import plus from "../img/plus.png";
import pencil from "../img/pencil.png";
import ProgressBar from "../components/ProgressBar.jsx"

import { ToDoContext } from "../todo.jsx";
function CenterContent({ taskList, centerWidth, newTaskToCenter, addNewTaskToCenter, setTaskCheckbox, setTaskToEdit, setRightWidth, setCenterWidth, }) {
    const { taskCheckbox } = useContext(ToDoContext);
    const [tasks, setTasks] = useState([]);
    const [taskStatus, setTaskStatus] = useState(false);
    const [pencilVisibleId, setPencilVisibleId] = useState(null);
    const openRightMenu = (task) => {
        setCenterWidth(6);
        setRightWidth(3);
        setTaskToEdit(task);
    }
    const changeTaskStatus = async (taskId, newStatus) => {
        await window.electronAPI.changeTaskStatus(taskId, newStatus);
    }
    const updateCompleteAlready = async (completeAlready, taskId) => {
        if (completeAlready) {
            await window.electronAPI.changeTaskCompleteAlready(taskId, completeAlready)
        }
    }

    useEffect(() => {
        if (taskList) {
            const getTasks = async () => {
                const result = await window.electronAPI.getTasks(taskList.id);
                setTasks(result.map(content => content.dataValues));
            };
            getTasks();
        }

    }, [taskList, newTaskToCenter, taskStatus]);
    useEffect(() => {
        if (newTaskToCenter) {
            addNewTaskToCenter(false);
        }
    }, [newTaskToCenter]);

    const completeAlreadyField = (task) => {
        return (
            <input type="number" className="field-without-styles text-end" defaultValue={task.completeAlready} style={{ width: `${String(task.needToComplete).length + 3}ch` }} onChange={(e) => { updateCompleteAlready(e.target.value, task.id) }} />
        )
    }
    const getTasksByPriority = (priority) => {
        const listOfTasks = tasks.filter((task) => task.priority == priority).map((task) => (
            <div key={task.id} className="d-flex align-items-center mb-2 ms-4" onMouseOver={() => setPencilVisibleId(task.id)} onMouseLeave={() => setPencilVisibleId(null)}>
                <div className="checkbox-wrapper-31 d-flex">
                    <input type="checkbox" id={"task" + task.id} checked={task.status} onChange={(e) => { changeTaskStatus(task.id, e.target.checked); setTaskStatus(!taskStatus); setTaskCheckbox(!taskCheckbox) }} />
                    <svg viewBox="0 0 35.6 35.6">
                        <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                        <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                        <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                    </svg>
                </div>
                <label className="d-flex form-check-label fs-4 ms-2" htmlFor={"task" + task.id}> {task.title} {task.type == 2 && (
                    <>
                        {completeAlreadyField(task)} / {task.needToComplete}
                    </>
                )}<span className="opacity-50 ms-2"> - {task.dateOfEnd}</span></label>
                <button className={"btn-img " + (pencilVisibleId == task.id ? "" : "d-none")} onClick={() => openRightMenu(task)}><img src={pencil} width="30" height="30" className="hover" /></button>
            </div>
        ));
        if (listOfTasks.length > 0) {
            return listOfTasks;
        } else {
            return false;
        }
    }
    return (
        <Col className={"custom-dark d-flex justify-content-center " + (taskList ? "align-items-baseline" : "align-items-center")} sm={centerWidth}>
            {taskList ? (
                <div className="w-100 d-flex justify-content-center mt-3 flex-column ">
                    <div className='d-flex justify-content-around'>
                        <h4 className="d-flex">{taskList.title}</h4>
                        <ProgressBar
                            PBclass="progress-bar"
                            taskListId={taskList.id}
                            newTaskToCenter={newTaskToCenter}
                        />
                    </div>
                    <div className="d-flex ms-5 mt-5 flex-column justify-content-start ">
                        {getTasksByPriority(1) && (
                            <div>
                                <h3>A ( Очень важные )</h3>
                                {getTasksByPriority(1)}
                            </div>

                        )}
                        {getTasksByPriority(2) && (
                            <div>
                                <h3>B ( Второстепенные )</h3>
                                {getTasksByPriority(2)}
                            </div>

                        )}
                        {getTasksByPriority(3) && (
                            <div>
                                <h3>C ( Могут подождать )</h3>
                                {getTasksByPriority(3)}
                            </div>

                        )}
                        <button className="d-flex hover btn-img align-items-center" onClick={() => { openRightMenu(); setTaskToEdit(false) }}>
                            <img src={plus} alt="" width="30px" height="30px" />
                            <span className='ms-2 fs-4'>Добавить задачу</span>
                        </button>
                    </div>
                </div>
            ) : (<div className='opacity-50 d-flex  flex-column'>
                <p>Составляй цели по SMART:</p>
                <p>Specific — конкретная</p>
                <p>Measurable — измеримая</p>
                <p>Achievable — достижимая</p>
                <p>Relevant — значимая</p>
                <p>Time bound — ограниченная во времени</p>
            </div>)}
        </Col>
    )
}
export { CenterContent }