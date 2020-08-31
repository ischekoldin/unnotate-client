import React, {useEffect, useState} from "react";

import "./SideBar.css";
import {useDispatch} from "react-redux";

import ChangePasswordForm from "../ChangePasswordForm/ChangePasswordForm";

import logoutIcon from "./../../images/icons/logout.png";
import changePasswordIcon from "./../../images/icons/change-password.png";
import arrowDownIcon from "./../../images/icons/arrow-down.png";

const SideBar = ({location}) => {

    //console.log(location.state.username);
    const [isUserMenuShown, setIsUserMenuShown] = useState(false);
    const [isChangePasswordDialogueShown, setIsChangePasswordDialogueShown] = useState(false);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        switch (event.currentTarget.className) {
            case "userMenuButton": {
                setIsUserMenuShown(!isUserMenuShown);
                break
            }
            case "userMenuEntry": {
                if (event.currentTarget.innerText === "Change password") {
                    setIsChangePasswordDialogueShown(true);
                    break
                } else {
                    dispatch({
                        type: "auth/logout",
                        payload: true
                    });
                    break
                }
            }
        }
    };

    const hideUserMenu = () => {
        setIsUserMenuShown(false);
    };

    useEffect(() => {
        if (isUserMenuShown) {
            document.addEventListener("click", hideUserMenu);
        }
        return () => document.removeEventListener("click", hideUserMenu);
    },[isUserMenuShown]);

    return (
        <div className="d-flex flex-column h-100 justify-content-between sideBar mr-0 pr-0 pl-2">
            <h4>PS</h4>
            <div>
                {
                    // check if there is a user name  to show
                    location && location.state && location.state.username
                        ? <h4 className="userMenuButton"
                              onClick={handleClick}>
                            {location.state.username}
                            <img id="arrowDownIcon" src={arrowDownIcon} alt="arrow down" />
                        </h4>
                        : <h4>Log in</h4>
                }
            </div>


            {
                isUserMenuShown
                ? <div className="userMenu">
                    <div onClick={handleClick} className="userMenuEntry">
                        Change password
                        <img className="menuIcon" src={changePasswordIcon} alt="change password" />
                    </div>
                    <div onClick={handleClick} className="userMenuEntry">
                        Logout
                        <img className="menuIcon" src={logoutIcon} alt="logout" />
                    </div>
                </div>
                : null
            }

            {
                isChangePasswordDialogueShown
                ? <ChangePasswordForm setIsChangePasswordDialogueShown={setIsChangePasswordDialogueShown} />
                : null
            }
        </div>
    )

};

export default SideBar;