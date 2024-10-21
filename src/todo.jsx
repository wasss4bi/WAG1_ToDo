import React, { useState, createContext } from 'react';
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { LeftItems } from "./modules/LeftItems.jsx";
import { CenterContent } from "./modules/CenterContent.jsx";
import { RightMenu } from "./modules/RightMenu.jsx";

export const LeftItemsContext = createContext();
export const ToDoContext = createContext();

function ToDo() {
    const [taskList, setTaskList] = useState();
    const [centerWidth, setCenterWidth] = useState(9);
    const [rightWidth, setRightWidth] = useState(0);
    const [newTaskToCenter, addNewTaskToCenter] = useState(false);
    const [taskCheckbox, setTaskCheckbox] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState();
    return (
        <Container fluid>
            <ToDoContext.Provider value={{ taskCheckbox }}>
                <Row>
                    <LeftItemsContext.Provider value={{ newTaskToCenter, setTaskList }}>
                        <LeftItems
                            setRightWidth={setRightWidth}
                            setCenterWidth={setCenterWidth}
                        />
                    </LeftItemsContext.Provider>
                    <CenterContent
                        taskList={taskList}
                        centerWidth={centerWidth}
                        newTaskToCenter={newTaskToCenter}
                        setRightWidth={setRightWidth}
                        setCenterWidth={setCenterWidth}
                        addNewTaskToCenter={addNewTaskToCenter}
                        setTaskCheckbox={setTaskCheckbox}
                        setTaskToEdit={setTaskToEdit}
                    />
                    <RightMenu
                        taskList={taskList}
                        rightWidth={rightWidth}
                        taskToEdit={taskToEdit}
                        setRightWidth={setRightWidth}
                        setCenterWidth={setCenterWidth}
                        addNewTaskToCenter={addNewTaskToCenter}
                    />
                </Row>
            </ToDoContext.Provider>
        </Container>
    )
}
export default ToDo;

