import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
function ItemsFromParent({ taskItemId, item, newTaskToCenter }) {
    const [itemsFromParent, setItemsFromParent] = useState([]);
    useEffect(() => {
        const fetchItems = async () => {
            if (taskItemId) {
                const fetchedItems = await window.electronAPI.getItemsFromParent(taskItemId);
                setItemsFromParent(fetchedItems);
            }
        };
        fetchItems();
    }, [taskItemId, item, newTaskToCenter]);
    return (
        <div className="opacity-50 ms-3">
            {
                itemsFromParent.length > 0 ? (
                    itemsFromParent.map((itemFromParent, index) => <div key={index}>{itemFromParent._doc.title}</div>)
                ) : (
                    <div>Нет элементов</div>
                )
            }
        </div>
    )

}
export default ItemsFromParent