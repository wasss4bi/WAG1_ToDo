import React, { useContext, createContext, useState } from 'react';
const ToDoContext = createContext();
function Component() {
    const [message, setMessage] = useState("There's nothing");
    return (
        <ToDoContext.Provider value={{ message, setMessage }}>
            <ChildComponent />
        </ToDoContext.Provider>
    )
}
function ChildComponent() {
    return (
        <div>
            <MessageComponent />
        </div>
    )
}
function MessageComponent() {
    const { message, setMessage } = useContext(ToDoContext);
    return (
        <div>
            <h1>{message}</h1>
            <button onClick={() => setMessage('Hello from Child')}>Change Message</button>
        </div>
    )
}



import React, { useState, useMemo } from 'react';

function Calc() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');

    const Calculation = useMemo(() => {
        console.log('Выполняется вычисление...');
        return count * 2;
    }, [count]); // вычисление произойдет только при изменении count

    return (
        <div>
            <h1>Вычисление: {Calculation}</h1>
            <button onClick={() => setCount(count + 1)}>Увеличить счетчик</button>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Измените текст"
            />
        </div>
    );
}


import React, { Suspense, lazy } from 'react';

// Ленивый импорт компонента
const LazyComponent = lazy(() => import('./LazyComponent.jsx'));

function App() {
    return (
        <div>
            <h1>Пример использования Suspense и lazy</h1>
            {/* fallback - компонент, выводящийся до загрузки компонента*/}
            <Suspense fallback={<div>Загрузка...</div>}> 
                <LazyComponent />
            </Suspense>
        </div>
    );
}

export default App;


export { Component, Calc }