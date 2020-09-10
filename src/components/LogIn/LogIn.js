import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import SideBar from "../SideBar/SideBar";
import "./LogIn.scss";
import LoginAndRegisterForm from "./LoginAndRegisterForm/LoginAndRegisterForm";
import ModalDialogue from "./ModalDialogue/ModalDialogue";

const LogIn = () => {


    const ENDPOINT = useSelector(state => state.endpoint);
    const [tryCookieLogin, setTryCookieLogin] = useState(true);
    const [isRegisterForm, setIsRegisterForm] =useState(false);
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [rememberMeValue, setRememberMeValue] = useState('');
    const [feedback, setFeedback] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    let errors = [];


    const CONFIG_REFRESH_TOKEN = {
        method: 'get',
        url: `${ENDPOINT}/token`,
        withCredentials: true
    };

    const CONFIG_LOGIN = {
        method: 'post',
        url: `${ENDPOINT}/login`,
        headers: { 'Content-Type': 'application/json' },
        data: { name: nameValue, password: passwordValue, rememberMe: rememberMeValue },
        withCredentials: true
    };


    const CONFIG_SIGNUP = {
        method: 'post',
        url: `${ENDPOINT}/signup`,
        data: { name: nameValue, email: emailValue, password: passwordValue }
    };



    const handleChange = (event) => {
        let inputId = event.target.id;
        let value = event.target.value;

        switch (inputId) {
            case "email":  {
                setEmailValue(value);
                break
            }
            case "password":  {
                setPasswordValue(value);
                break
            }
            case "name":  {
                setNameValue(value);
                break
            }
            case "rememberMe":  {
                setRememberMeValue(!rememberMeValue);
                break
            }
            default:
        }

    };


    const refreshToken = useCallback (async () => {
        try {
            return await axios(CONFIG_REFRESH_TOKEN);
        } catch (err) {
            errors.push({place:"refreshToken function", message: err.message});
        }
    },[CONFIG_REFRESH_TOKEN], errors);



    // register or log in, depends on the form mode
    const handleSubmit = async (event) => {
        event.preventDefault();

        let response;

        if (isRegisterForm) {

            response = await axios(CONFIG_SIGNUP);


            if (typeof response === "string") {
                setFeedback(...feedback, response);
            }

            setIsRegisterForm(!isRegisterForm);

        } else {

            try {
                response = await axios(CONFIG_LOGIN);
                dispatch({
                    type: 'user/set',
                    payload: nameValue
                });
                history.push({
                    pathname: '/notes',
                    state: {
                        token: response.data.accessToken,
                        username: nameValue,
                        rememberMe: rememberMe
                    }
                });
            } catch (err) {
                errors.push({place:"handleSubmit function", message: err.message});
            }
        }
    };

    // check if rememberMe option has been set to true and try to get a new access token
    const rememberMe = document.cookie
        .replace(/(?:(?:^|.*;\s*)unnotateRememberMe\s*=\s*([^;]*).*$)|^.*$/, "$1");
    console.info(rememberMe);
    if (rememberMe) {
        refreshToken().then(
            (newAccessToken) => {
                if (newAccessToken) {
                    history.push({
                        pathname: '/notes',
                        state:
                            {
                                token: newAccessToken.data.accessToken,
                                username: newAccessToken.data.name
                            }
                    });
                }
            }
        ).catch();
    }

    // spew some errors in dev environment
    if (ENDPOINT === "http://localhost:5000" && errors.length > 0) {
        console.info(errors);
    }

    return (
        <div className="container-fluid h-100vh p-0">
            <div className="row h-100 p-0 no-gutters">
                <div className="col-md-1 col-sm-12 p-0 side-bar-container">
                    <SideBar />
                </div>

                {feedback.length > 0 ? <ModalDialogue messages={feedback} /> : null }

                <div className="col-auto ml-auto mb-auto mr-auto mt-sm-0 mt-0 mt-md-auto">
                    <div className="card p-3 border border align-self-center">
                        <LoginAndRegisterForm
                            isRegisterForm={isRegisterForm}
                            setIsRegisterForm={setIsRegisterForm}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            emailValue={emailValue}
                            nameValue={nameValue}
                            passwordValue={passwordValue}
                            rememberMeValue={rememberMeValue}
                        />
                    </div>
                </div>
            </div>
        </div>

    )

};

export default LogIn;