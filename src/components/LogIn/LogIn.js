
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import SideBar from "../SideBar/SideBar";

import "./LogIn.scss";
import {useMediaQuery} from "react-responsive/src";

const LogIn = () => {


    const ENDPOINT = useSelector(state => state.endpoint);
    const [isRegisterForm, setIsRegisterForm] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [rememberMeValue, setRememberMeValue] = useState('');
    let history = useHistory();
    const dispatch = useDispatch();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});


    const handleChange = (event) => {
        let inputId = event.target.id;
        if (inputId === "email") {
            setEmailValue(event.target.value);
        } else if (inputId === "password") {
            setPasswordValue(event.target.value);
        } else if (inputId === "name") {
            setNameValue(event.target.value);
        } else {
            setRememberMeValue(!rememberMeValue);
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        let response;

        if (isRegisterForm) {

            await axios.post(
                `${ENDPOINT}/signup`,
                {
                    name: nameValue,
                    email: emailValue,
                    password: passwordValue
                }
            );

            setIsRegisterForm(!isRegisterForm);

        } else {

            response = await axios.post(
                `${ENDPOINT}/login`,
                {
                    name: nameValue,
                    password: passwordValue
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            dispatch({
                type: 'user/set',
                payload: nameValue
            });
            history.push({
                pathname: '/notes',
                state:
                {
                    token: response.data.accessToken,
                    username: nameValue
                }
            });
        }

    };


    return (
        <div className="container-fluid h-100vh p-0">
            <div className="row h-100 p-0 no-gutters">
                <div className="col-md-1 col-sm-12 p-0" style={!isScreenNarrow ? {flex: "0 0 2.1%"} : {height: "fit-content"} }>
                    <SideBar />
                </div>

                <div className="col-auto ml-auto mb-auto mr-auto mt-sm-0 mt-0 mt-md-auto">
                    <div className="card p-3 border border align-self-center">
                        {isRegisterForm ? "Register" : "Log in"}
                        <form className="form card-body" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">name</label>
                                <input className="form-control"
                                       value={nameValue}
                                       onChange={handleChange}
                                       id="name"
                                       type="text"
                                       required
                                />
                                {!isRegisterForm ? null : <label>email</label>}
                                {!isRegisterForm ? null : <input className="formInput"
                                                                 value={emailValue}
                                                                 onChange={handleChange}
                                                                 id="email"
                                                                 type="email"
                                                                 required
                                />}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">password</label>
                                <input className="form-control"
                                       value={passwordValue}
                                       onChange={handleChange}
                                       id="password"
                                       type="password"
                                       required
                                />
                            </div>
                            <div className="form-group row">
                                {isRegisterForm ? null : <label className="col-7" htmlFor="rememberMe">remember me</label>}
                                {isRegisterForm ? null : <input className="formCheckbox col-auto"
                                                           value={rememberMeValue}
                                                           onChange={handleChange}
                                                           id="rememberMe"
                                                           type="checkbox"
                                                        />
                                }
                            </div>

                            <div className="form-group row">
                                <div className="col-6">
                                    {
                                        !isRegisterForm
                                            ?   <button className="btn btn-primary"
                                                        onClick={() => setIsRegisterForm(!isRegisterForm)}
                                                        type="button"
                                                        id="registerBtn">Register
                                            </button>

                                            :   <button className="btn btn-primary"
                                                        type="submit"
                                                        id="signUpBtn">Register
                                            </button>

                                    }
                                </div>
                                <div className="col-6 ">
                                    {
                                        !isRegisterForm
                                            ?   <button className="btn btn-primary"
                                                        type="submit"
                                                        id="signInBtn">Log in
                                            </button>

                                            :   <button className="btn btn-primary"
                                                        onClick={() => setIsRegisterForm(!isRegisterForm)}
                                                        type="button"
                                                        id="signInBtn">Log in
                                            </button>

                                    }
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )

};

export default LogIn;