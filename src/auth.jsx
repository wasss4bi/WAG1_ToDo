import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
function LoginForm({ showForm, setShowForm, doLogin }) {
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();
    const [loginError, setLoginError] = useState(false);
    const loginUser = async () => {
        const login = await window.electronAPI.loginUser(userEmail, userPassword);
        if (login !== false) {
            doLogin(login);
        }else{
            setLoginError("Неправильный логин или пароль");
        };
    }
    if (showForm == "login") {
        return (
            <div>
                <Row className="justify-content-between mb-3">
                    <Col sm={4} className="fs-2">Авторизация</Col>
                    <Col sm={5} onClick={() => setShowForm("register")}>Нет аккаунта? <span className="custom-link">Зарегистрироваться</span></Col>
                </Row>
                <div>
                <h5 className='text-danger'>{loginError}</h5>
                    <Form>
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Введите e-mail" className='mb-3' onChange={(e) => setUserEmail(e.target.value)} required />

                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" placeholder="Введите Пароль" className='mb-3' onChange={(e) => setUserPassword(e.target.value)} required />

                        <Button variant="primary" onClick={loginUser}>
                            Войти
                        </Button>
                    </Form>
                </div>
            </div>
        )
    } else {
        return;
    }
}
function RegisterForm({ showForm, setShowForm }) {
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();
    const registerUser = async () => {
        await window.electronAPI.registerUser(userName, userEmail, userPassword);
    }
    if (showForm == "register") {
        return (
            <div>
                <Row className="justify-content-between mb-3">
                    <Col sm={4} className="fs-2">Регистрация</Col>
                    <Col sm={5} onClick={() => setShowForm("login")}>Есть аккаунт? <span className="custom-link">Авторизоваться</span></Col>
                </Row>
                <div>
                    <Form>
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control type="text" placeholder="Введите имя" className='mb-3' onChange={(e) => setUserName(e.target.value)} required />

                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="text" placeholder="Введите e-mail" className='mb-3' onChange={(e) => setUserEmail(e.target.value)} required />

                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" placeholder="Введите Пароль" className='mb-3' onChange={(e) => setUserPassword(e.target.value)} required />

                        <Button variant="primary" onClick={registerUser}>
                            Зарегистрироваться
                        </Button>
                    </Form>
                </div>
            </div>
        )
    } else {
        return;
    }
}
function AuthForm() {
    const [user, doLogin] = useState(false);
    const [showForm, setShowForm] = useState("login");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user == false) {
            localStorage.setItem('user', JSON.stringify(user.dataValues));
            navigate("/todo");
        }
    }, [user]);
    return (
        <Container fluid>
            <Row className="justify-content-center mt-5 ">
                <Col sm={7} className="rounded-5 custom-grey border border-light border-2 p-4">
                    <LoginForm showForm={showForm} setShowForm={setShowForm} doLogin={doLogin} />
                    <RegisterForm showForm={showForm} setShowForm={setShowForm} />
                </Col>
            </Row>
        </Container>
    )
}

export default AuthForm;