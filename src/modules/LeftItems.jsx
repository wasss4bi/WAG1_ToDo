import React, { useState, useEffect, Suspense, lazy, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import newFolder from "../img/new-folder.png";
import lupa from "../img/lupa.png";
import krest from "../img/krest.png";
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
    const [isSearchVisible, setIsSearchVisible] = useState(false); // Состояние для отображения поля поиска
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения поискового запроса
    const navigate = useNavigate();

    const getUserFromLocalStorage = () => {
        if (localStorage.getItem('user') != undefined) {
            return JSON.parse(localStorage.getItem('user'));
        } else {
            return false;
        }
    }

    const user = getUserFromLocalStorage();

    useEffect(() => {
        if (!logout == false && !user) {
            console.log("beeb");
            doLogout(true);
            localStorage.removeItem('user');
            navigate('/');
        }
    }, [logout]);

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
        if (item.parentId != null) {
            const result = await window.electronAPI.getTaskItemById(item.parentId);
            console.log(result);

            setItem(result[0]._doc);
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

    // Функция для открытия/закрытия поля поиска
    const toggleSearch = useCallback(() => {
        setIsSearchVisible(!isSearchVisible);
        setSearchQuery(''); // Очистка поискового запроса при закрытии
    }, [isSearchVisible]);

    // Функция для обработки изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Функция для выполнения поиска
    const performSearch = async () => {
        console.log("Searching for:", searchQuery);
        const taskItems = await window.electronAPI.searchTaskItems(searchQuery);
        console.log(taskItems);
        
    };

    return (
        <Col className="p-0 d-flex overflow-hidden flex-column align-items-between" sm={3}>
            <div className="w-100">
                <div className="menu-header custom-grey d-flex justify-content-between p-3 align-items-center">
                    {isSearchVisible ? (
                        // Поле поиска и кнопка закрытия
                        <>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Поиск..."
                                value={searchQuery}
                                onChange={(e) => {handleSearchChange(e); performSearch() }}
                            />
                            <button className="btn-img hover" onClick={toggleSearch}>
                                <img src={krest} alt="Закрыть поиск" className="left-menu-header-img" />
                            </button>
                        </>
                    ) : (
                        // Обычное содержимое .menu-header
                        <>
                            {item ? (
                                <button className="d-flex border-0 hover h-100 btn-img" onClick={backward}>
                                    <img src={leftArrow} alt="" className="left-menu-header-img" />
                                </button>
                            ) : null}
                            <div className="fs-3 text-white d-flex h-100 align-items-center ">
                                {item ? item.title : "Каталоги"}
                            </div>
                            <div className="h-100 d-flex align-items-end gap-1">
                                {item ? (
                                    <button onClick={() => handleShow("tasklist")} className="new-folder hover btn-img">
                                        <img src={newTasklist} className="left-menu-img" />
                                    </button>
                                ) : null}
                                <button onClick={() => handleShow("catalog")} className="new-folder hover btn-img">
                                    <img src={newFolder} className="left-menu-img" />
                                </button>
                                <button onClick={toggleSearch} className="new-folder hover btn-img">
                                    <img src={lupa} className="left-menu-img" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <CreateItemModal
                    show={show}
                    handleClose={handleClose}
                    type={type}
                    id={item ? item._id : null}
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
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setIsSearchVisible={setIsSearchVisible}
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
                    <button onClick={() => { doLogout(true) }} className="btn-img hover">
                        <img src={logoutImg} alt="" width="40px" />
                    </button>
                </div>
            </div>
        </Col>
    );
}

export { LeftItems };