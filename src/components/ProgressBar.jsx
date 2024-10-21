import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { ToDoContext } from "../todo.jsx";
function ProgressBar({ PBclass, taskListId, newTaskToCenter }) {
    const { taskCheckbox } = useContext(ToDoContext);
    const [progress, setProgress] = useState();
    useEffect(() => {
        const completedPercent = async (taskListId) => {
            const percent = await window.electronAPI.getCompletedPercent(taskListId);
            setProgress(String(percent).slice(0, 4));
        }
        completedPercent(taskListId);
    }, [taskCheckbox, taskListId, newTaskToCenter]);

    const getProgressColor = useCallback((progress) => {
        const hue = (progress / 100) * 120;
        return `hsl(${hue}, 100%, 50%)`;
    }, []);
    const progressBar = useMemo(() => {
        return (
            <div className={PBclass + " rounded-5 overflow-hidden d-flex flex-row"}>
                <div className="progress-bar-complete h-100 d-flex justify-content-end p-0 fs-5" style={{ width: progress + "%", backgroundColor: getProgressColor(progress) }}><span className="pe-3 text-dark fw-bolder">{PBclass == "progress-bar" ? progress + "%" : null}</span></div>
                <div className="progress-bar-need bg-white h-100 d-flex " style={{ width: (100 - progress + "%") }}></div>
            </div>
        )
    }, [PBclass, progress]);

    return progressBar;
}

export default ProgressBar