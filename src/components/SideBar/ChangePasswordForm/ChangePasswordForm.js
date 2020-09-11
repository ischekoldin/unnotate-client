import React, {useState} from "react";
import "./ChangePasswordForm.css";
import axios from "axios";
import {useSelector} from "react-redux";

const ChangePasswordForm = ({setIsChangePasswordDialogueShown, location}) => {

    const [oldPassword, setOldPassword] = useState(' ');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const name = location.state && location.state.username;

    const ENDPOINT = useSelector(state => state.endpoint);

    const CONFIG_CHANGE_PASSWORD = {
        method: 'post',
        url: `${ENDPOINT}/auth/change_password`,
        headers: { 'Content-Type': 'application/json' },
        data: { user: name, oldPassword: oldPassword, newPassword: newPassword }
    };


    const handleChange = (event) => {
        const inputChanged = event.currentTarget.name;
        const inputValue = event.currentTarget.value.trim();
        switch (inputChanged) {
            case "oldPassword": {
                setOldPassword(inputValue);
                break
            }
            case "newPassword": {
                setNewPassword(inputValue);
                break
            }
            case "repeatNewPassword": {
                setRepeatNewPassword(inputValue);
                break
            }
            default:
        }
    };


    // TODO: barebone, implement feedback
    const handleClick = (event) => {
        const buttonClicked = event.currentTarget.id;
        if (buttonClicked === "changePasswordButton") {
            axios(CONFIG_CHANGE_PASSWORD).then(setIsChangePasswordDialogueShown(false));
        } else if (buttonClicked === "closePasswordFormButton") {
            setIsChangePasswordDialogueShown(false);
        }
    };


    return (
        <div className="changePasswordFormWrapper">
            <form className="changePasswordForm card form">
                <span className="text-center card-header">Change password</span>

                <div className="card-body">
                    <div className="form-group">
                        <label>Old password:</label>
                        <input onChange={handleChange} type="password" name="oldPassword" className="form-control" required />
                    </div>

                    <div className="form-group">
                        <label>New password:</label>
                        <input onChange={handleChange} type="password" name="newPassword" className="form-control" required />
                    </div>

                    <div className="form-group">
                        <label>Repeat new password:</label>
                        {
                            newPassword !== repeatNewPassword
                                ? <div className="alert alert-warning" role="alert">Passwords don't match</div>
                                : null
                        }
                        <input onChange={handleChange} type="password" name="repeatNewPassword" className="form-control" required />
                    </div>

                    <div className="form-group d-flex justify-content-between">
                        <button id="changePasswordButton"
                                className="btn btn-primary"
                                onClick={handleClick}
                                type="button">Change password</button>

                        <button id="closePasswordFormButton"
                                className="btn btn-primary"
                                onClick={handleClick}
                                type="button">Back</button>
                    </div>

                </div>


            </form>
        </div>
    )

};

export default ChangePasswordForm;