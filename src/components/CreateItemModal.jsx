import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function CreateItemModal({ show, type, id, handleClose, taskTitle, setTaskTitle, editedTaskItemId }) {

    const addItem = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await window.electronAPI.addTaskItem(user.id, taskTitle, type, id);
        } catch (error) {
            console.log(error);
        };
        handleClose();
    }
    const updateTaskItem = async (taskItemId, taskItemTitle) => {
        try {
            await window.electronAPI.updateTaskItem(taskItemId, taskItemTitle);

        } catch (error) {
            console.log(error);
        }

        handleClose();
    }
    return (
        <Modal size="lg" show={show} onHide={handleClose} contentClassName="custom-grey">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{editedTaskItemId ? "Редактирование элемента" : type == "catalog" ? "Создание каталога" : "Создание списка задач"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>{editedTaskItemId ? "Название элемента" : type == "catalog" ? "Название каталога" : "Создание списка задач"}</Form.Label>
                <Form.Control type="text" value={taskTitle || ''} placeholder="Введите название" onChange={(e) => setTaskTitle(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { editedTaskItemId ? updateTaskItem(editedTaskItemId, taskTitle) : addItem() }}>
                    {editedTaskItemId ? "Сохранить" : "Создать"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default CreateItemModal