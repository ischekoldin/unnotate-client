import React, {useEffect, useState} from "react";

import "./SideBar.scss";
import {useDispatch} from "react-redux";

import ChangePasswordForm from "../ChangePasswordForm/ChangePasswordForm";

import logoutIcon from "./../../images/icons/logout.png";
import changePasswordIcon from "./../../images/icons/change-password.png";
import {isMobile} from "react-device-detect";

import SideBarBody from "./SideBarBody/SideBarBody";


const SideBar = ({location}) => {


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
        <div className="row sideBar justify-content-between no-gutters">

            <SideBarBody isMobile={isMobile}
                         handleUserMenuButtonClick={handleUserMenuButtonClick}
                         location={location} />

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