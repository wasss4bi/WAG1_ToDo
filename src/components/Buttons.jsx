import React, { useState, useEffect, forwardRef, useMemo, useCallback, memo, useContext } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import folder from "../img/folder.png";
import tasklist from "../img/tasklist.png";
import tripleDot from "../img/triple-dot.png";
import ProgressBar from "./ProgressBar.jsx";
import ItemsFromParent from "./ItemsFromParent.jsx";
import { LeftItemsContext, ToDoContext } from '../todo.jsx';
import { useNavigate } from 'react-router-dom';
function Buttons({ item, showItemsOnAdding, searchQuery, setSearchQuery, setIsSearchVisible, setShowItemsOnAdding, setEditedTaskItemId, setShow, setTaskTitle, setType, setItem }) {
    const { newTaskToCenter, setTaskList } = useContext(LeftItemsContext);
    const { taskCheckbox } = useContext(ToDoContext);
    const [taskItems, setTaskItems] = useState([]);
    const getUserFromLocalStorage = () => {
        if (localStorage.getItem('user') !== undefined) {
            return JSON.parse(localStorage.getItem('user'));
        } else {
            return false;
        }
    }
    const user = getUserFromLocalStorage();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            console.log("beeb");
            localStorage.removeItem('user');
            navigate('/');
        }
    }, [user]);
    useEffect(() => {
        const getItems = async () => {
            let result = [];
            if (searchQuery.length > 0) {
                result = await window.electronAPI.searchTaskItems(searchQuery);
            } else {
                result = await window.electronAPI.getTaskItemsByParentId(user._id, item ? item._id : null);
            }
            console.log(item);
            setTaskItems(result.map(content => content._doc));
        };
        getItems();
    }, [item, showItemsOnAdding, searchQuery]);

    useEffect(() => {
        if (showItemsOnAdding) {
            setShowItemsOnAdding(false);
        }
    }, [showItemsOnAdding]);

    const showItemContent = useCallback((taskItem) => {
        console.log(taskItem);
        setSearchQuery("");
        setIsSearchVisible(false);
        if (taskItem.type == "catalog") {
            setItem(taskItem);
            setTaskList(false);
        } else {
            setTaskList(taskItem);
        }
    }, []);
    const deleteTaskItem = useCallback(async (taskItemId) => {
        try {
            await window.electronAPI.deleteTaskItem(taskItemId);
        } catch (error) {
            console.log(error);
        }
        setShowItemsOnAdding(true);
    }, [])
    const CustomToggle = memo(forwardRef(({ children, onClick, }, ref) => (
        <a href="" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }} onMouseLeave={(e) => { e.preventDefault(); }}>
            {children}
        </a>
    )));

    const buttons = useMemo(() => {
        return taskItems.length > 0 ? taskItems.map((taskItem, index) => (
            <div key={index} className="rounded-3 d-flex custom-grey border-0 m-1 justify-content-between">
                <Button className="rounded-3 d-flex custom-grey hover border-0 pt-2 w-100" onClick={() => showItemContent(taskItem)} >
                    <div className="d-flex me-2 ">
                        {taskItem.type == "catalog" ? <img src={folder} className="d-flex left-item-img " /> : <img src={tasklist} className="d-flex left-item-img px-2" />}
                    </div>
                    <div className="w-100 text-start ">
                        <div className='d-flex justify-content-between'>
                            <div className="fs-4 d-flex lh-1">{taskItem.title}</div>
                        </div>
                        <ItemsFromParent
                            taskItemId={taskItem._id}
                            item={item}
                            newTaskToCenter={newTaskToCenter}
                        />
                        {taskItem.type == "tasklist" &&
                            <ProgressBar
                                PBclass="catalog-progress-bar"
                                taskListId={taskItem._id}
                                newTaskToCenter={newTaskToCenter}
                            />
                        }
                    </div>
                </Button>
                <div className={"pt-2 d-flex "}>
                    <Dropdown>
                        <Dropdown.Toggle variant="none" as={CustomToggle} >
                            <img src={tripleDot} alt="" height="20px" className="btn-img hover d-flex" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { deleteTaskItem(taskItem._id) }}>Удалить</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setEditedTaskItemId(taskItem._id); setShow(true); setTaskTitle(taskItem.title) }}>Редактировать</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        )) : <div className='d-flex justify-content-center align-items-center opacity-50 h-100'>
            <div className='d-flex'>
                <span> Здесь пока ничего нет. Создайте <span className='text-primary custom-link' onClick={() => { setShow(true); setType("catalog") }}>каталог</span>
                    <span>{item && <> или <span className='text-primary custom-link' onClick={() => { setShow(true); setType("tasklist") }}> список задач</span></>}</span>
                </span>
            </div>
        </div>;
    }, [taskItems, item, newTaskToCenter, taskCheckbox])
    return buttons;
}

export default Buttons 