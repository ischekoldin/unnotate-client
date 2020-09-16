import React, {useEffect, useState} from "react";

import "./SideBar.scss";
import {useDispatch} from "react-redux";

import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm";

import {useMediaQuery} from "react-responsive/src";


const SideBar = ({location}) => {

    const [isUserMenuShown, setIsUserMenuShown] = useState(false);
    const [isChangePasswordDialogueShown, setIsChangePasswordDialogueShown] = useState(false);
    const dispatch = useDispatch();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});

    const handleUserMenuButtonClick = () => {
        setIsUserMenuShown(!isUserMenuShown);
    };

    const handleUserMenuEntryClick = (event) => {
        if (event.currentTarget.id === "change-password") {
            setIsChangePasswordDialogueShown(true);
        } else if (event.currentTarget.id === "logout"){
            dispatch({
                type: "auth/logout",
                payload: true
            });
        }
    };


    const hideUserMenu = () => {
        setIsUserMenuShown(false);
    };

    // hide user menu on a click outside it
    useEffect(() => {
        if (isUserMenuShown) {
            document.addEventListener("click", hideUserMenu);
        }
        return () => document.removeEventListener("click", hideUserMenu);
    },[isUserMenuShown]);

    return (
        <div className="side-bar">

            <div className="logo-container">
                <div className="side-bar-item">
                    <span id="logo">UnNotate</span>
                </div>
            </div>

            <div className="user-menu-button-container">

                {
                    // show the user menu button or log in label
                    location && location.state && location.state.username
                        ?   <div className={`user-menu-button side-bar-item ${isScreenNarrow ? "ml-5" : ""}`}
                                onClick={handleUserMenuButtonClick}>
                                <span className="text-nowrap">{location.state.username}</span>
                                <i className="far fa-angle-down ml-2 mt-1" />
                            </div>

                        :   <div className={`side-bar-item ${isScreenNarrow ? "ml-5" : ""}`}>
                                <span className="text-nowrap">Log in</span>
                            </div>
                }

            </div>

            {
                // show and hide user menu
                isUserMenuShown
                ?   <div className="user-menu ml-md-5">
                        <div onClick={handleUserMenuEntryClick} className="user-menu-entry text-nowrap" id="change-password">
                            Change password
                            <i className="far fa-key pl-3" />
                        </div>
                        <div onClick={handleUserMenuEntryClick}
                             className="user-menu-entry d-flex justify-content-between flex-grow-1 w-100" id="logout">
                            Logout
                            <i className="far fa-sign-out pl-md-5" />
                        </div>
                    </div>

                :   null
            }

            {
                // show and hide change password dialogue
                isChangePasswordDialogueShown
                ?   <ChangePasswordForm setIsChangePasswordDialogueShown={setIsChangePasswordDialogueShown}
                                        location={location} />
                :   null
            }
        </div>
    )

};

export default SideBar;