import React, {useState} from "react";
import "./ChangePasswordForm.css";

const ChangePasswordForm = ({setIsChangePasswordDialogueShown}) => {

    const [oldPassword, setOldPassword] = useState(' ');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');


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
        }
    };

    const handleClick = (event) => {
        const buttonClicked = event.currentTarget.id;
        if (buttonClicked === "changePasswordButton") {

        } else if (buttonClicked === "closePasswordFormButton") {
            setIsChangePasswordDialogueShown(false);
        }
    };

    const handleSubmit = () => {

    };

    return (
        <div className="changePasswordFormWrapper">
            <form className="changePasswordForm">

                <label>Old password:</label>
                {
                    !oldPassword
                    ? <div className="invalidField">Old password can't be empty</div>
                    : null
                }
                <input onChange={handleChange} type="password" name="oldPassword" className="formInput" required />

                <label>New password:</label>
                <input onChange={handleChange} type="password" name="newPassword" className="formInput" required />

                <label>Repeat new password:</label>
                {
                    newPassword !== repeatNewPassword
                    ? <div className="invalidField">Passwords don't match</div>
                    : null
                }
                <input onChange={handleChange} type="password" name="repeatNewPassword" className="formInput" required />
                
                <div className="formButtonsWrapper">
                    <button id="changePasswordButton"
                            className="formBtn"
                            onClick={handleClick}
                            type="button">Change password</button>

                    <button id="closePasswordFormButton"
                            className="formBtn"
                            onClick={handleClick}
                            type="button">Back</button>
                </div>

            </form>
        </div>
    )

};

export default ChangePasswordForm;