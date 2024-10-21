import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';

import AuthForm from "./auth.jsx";
const ToDo = lazy(()=>import("./todo.jsx"));


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import Loading from "./components/Loading.jsx";
function App() {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/todo" element={<ToDo />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);