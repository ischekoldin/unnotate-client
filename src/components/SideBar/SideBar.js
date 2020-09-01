import React, {useEffect, useState} from "react";

import "./SideBar.scss";
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

    const handleUserMenuButtonClick = (event) => {
        setIsUserMenuShown(!isUserMenuShown);
    };

    const handleUserMenuEntryClick = (event) => {
        if (event.currentTarget.innerText === "Change password") {
            setIsChangePasswordDialogueShown(true);
        } else {
            dispatch({
                type: "auth/logout",
                payload: true
            });
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
            <h4 style={{ color: "#CFC0D3" }} >PS</h4>
            <div>
                {
                    // check if there is a user name  to show
                    location && location.state && location.state.username
                        ? <h4 className="userMenuButton rotate-counter-clockwise"
                              style={{ color: "#CFC0D3" }}
                              onClick={handleUserMenuButtonClick}>
                            {location.state.username}
                            <img id="arrowDownIcon" src={arrowDownIcon} alt="arrow down" />
                        </h4>
                        : <h4 className="rotate-counter-clockwise" style={{ color: "#CFC0D3" }}>Log in</h4>
                }
            </div>


            {
                isUserMenuShown
                ? <div className="userMenu">
                    <div onClick={handleUserMenuEntryClick} className="userMenuEntry">
                        Change password
                        <img className="menuIcon" src={changePasswordIcon} alt="change password" />
                    </div>
                    <div onClick={handleUserMenuEntryClick} className="userMenuEntry">
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