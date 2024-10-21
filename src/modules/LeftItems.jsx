import React, { useState, useEffect, Suspense, lazy, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import newFolder from "../img/new-folder.png";
import newTasklist from "../img/new-tasklist.png";
import leftArrow from "../img/left-arrow.png";
import logoutImg from "../img/logout.png";
import Loading from "../components/Loading.jsx";
import { LeftItemsContext } from '../todo.jsx';
const Buttons = lazy(() => import("../components/Buttons.jsx"));
const CreateItemModal = lazy(() => import("../components/CreateItemModal.jsx"));

function LeftItems({ setRightWidth, setCenterWidth }) {
    const { setTaskList } = useContext(LeftItemsContext);
    const [taskTitle, setTaskTitle] = useState(null);
    const [show, setShow] = useState(false);
    const [type, setType] = useState();
    const [item, setItem] = useState();
    const [editedTaskItemId, setEditedTaskItemId] = useState();
    const [showItemsOnAdding, setShowItemsOnAdding] = useState(false);
    const [logout, doLogout] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleShow = useCallback((type) => {
        setShow(true);
        setType(type);
    }, []);
    const handleClose = useCallback(() => {
        setShow(false)
        setTaskTitle(null);
        setEditedTaskItemId(null);
        setShowItemsOnAdding(true);
    }, []);
    const backward = useCallback(async () => {
        if (item.parentId != 0) {
            const result = await window.electronAPI.getTaskItemById(item.parentId);
            setItem(result[0].dataValues);
            setTaskList(false);
            setRightWidth(0);
            setCenterWidth(9);
        } else {
            setItem("");
            setTaskList(false);
            setRightWidth(0);
            setCenterWidth(9);
        }
    }, [item]);
    useEffect(() => {
        if (!logout == false) {
            doLogout(true);
            localStorage.removeItem('user');
            navigate('/');
        }
    }, [logout]);
    return (
        <Col className="p-0 d-flex overflow-hidden flex-column align-items-between" sm={3}>
            <div className="w-100">
                <div className="menu-header custom-grey d-flex justify-content-between p-3 align-items-center">
                    {item ? (
                        <button className="d-flex border-0 hover h-100 btn-img" onClick={backward}>
                            <img src={leftArrow} alt="" className="left-menu-header-img" />
                        </button>
                    ) : ""}
                    <div className="fs-3 text-white d-flex h-100 align-items-center ">{item ? item.title : "Каталоги"}</div>
                    <div className="h-100 d-flex align-items-end">
                        {item ? (
                            <button onClick={() => handleShow("tasklist")} className="new-folder hover btn-img ">
                                <img src={newTasklist} className="left-menu-img " />
                            </button>
                        ) : ""}
                        <button onClick={() => handleShow("catalog")} className="new-folder hover btn-img">
                            <img src={newFolder} className="left-menu-img" />
                        </button>
                    </div>
                </div>
                <CreateItemModal
                    show={show}
                    handleClose={handleClose}
                    type={type}
                    id={item ? item.id : "0"}
                    taskTitle={taskTitle}
                    editedTaskItemId={editedTaskItemId}
                    setTaskTitle={setTaskTitle}
                />
                <div className="menu-content custom-darker p-0 m-0">
                    <Suspense fallback={<Loading />}>
                        <Buttons
                            setItem={setItem}
                            item={item}
                            showItemsOnAdding={showItemsOnAdding}
                            
                            setShowItemsOnAdding={setShowItemsOnAdding}
                            setEditedTaskItemId={setEditedTaskItemId}
                            setShow={setShow}
                            setTaskTitle={setTaskTitle}
                            setType={setType}
                        />
                    </Suspense>
                </div>
            </div>
            <div className="custom-grey w-100 p-3 fs-3 d-flex justify-content-between" style={{ height: "76px" }}>
                <div className='d-flex'>
                    {user.username}
                </div>
                <div className='d-flex'>
                    <button onClick={() => { doLogout(true) }} className="btn-img hover" >
                        <img src={logoutImg} alt="" width="40px" />
                    </button>
                </div>
            </div>
        </Col >
    );
}
export { LeftItems }