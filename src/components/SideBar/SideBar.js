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
        <div className="row sideBar justify-content-between no-gutters">

            <div className="col-sm-2 col-2 col-md-12 mt-md-5 pl-md-0 logo-col">
                <h4 id="logo" className="pl-sm-3 pl-md-0 mt-md-4 sideBarItem">UnNotate</h4>
            </div>

            <div className="col-sm-2 col-2 col-md-12 mr-5 mt-md-auto user-menu-col ">

                {
                    // show the user menu button or log in label
                    location && location.state && location.state.username
                        ?   <h4 className={`userMenuButton sideBarItem d-flex flex-row ${isScreenNarrow ? "ml-5" : ""}`}
                                onClick={handleUserMenuButtonClick}>
                                        <span className="text-nowrap">
                                            {location.state.username}
                                        </span>
                            <i className="far fa-angle-down ml-2 mt-1" />
                        </h4>

                        :   <h4 className={`sideBarItem ${isScreenNarrow ? "ml-5" : null}`}>
                            <span className="text-nowrap">Log in</span>
                        </h4>
                }

            </div>

            {
                // show and hide user menu
                isUserMenuShown
                ?   <div className="userMenu ml-md-5">
                        <div onClick={handleUserMenuEntryClick} className="userMenuEntry text-nowrap" id="change-password">
                            Change password
                            <i className="far fa-key pl-3" />
                        </div>
                        <div onClick={handleUserMenuEntryClick}
                             className="userMenuEntry d-flex justify-content-between flex-grow-1 w-100" id="logout">
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