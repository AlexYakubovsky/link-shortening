import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const {loading, error, request, clearError} = useHttp()
    const message = useMessage()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = e => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input
                                    name="email"
                                    id="email"
                                    type="text"
                                    value={form.email}
                                    onChange={changeHandler}/>
                                <label
                                    htmlFor="email">
                                    Введите E-mail
                                </label>
                            </div>
                            <div className="input-field">
                                <input
                                    name="password"
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={changeHandler}/>
                                <label
                                    htmlFor="password">
                                    Введите пароль
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <button
                            className='btn yellow darken-4'
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                            disabled={loading}>
                            Войти
                        </button>
                        <button
                            className='btn grey lighten-1 black-text'
                            onClick={registerHandler}
                            disabled={loading}>
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}