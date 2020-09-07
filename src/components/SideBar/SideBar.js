import React, {useEffect, useState} from "react";

import "./SideBar.scss";
import {useDispatch} from "react-redux";

import ChangePasswordForm from "../ChangePasswordForm/ChangePasswordForm";

import logoutIcon from "./../../images/icons/logout.png";
import changePasswordIcon from "./../../images/icons/change-password.png";
import {isMobile} from "react-device-detect";

import SideBarBody from "./SideBarBody/SideBarBody";
import {useMediaQuery} from "react-responsive/src";


const SideBar = ({location}) => {


    const [isUserMenuShown, setIsUserMenuShown] = useState(false);
    const [isChangePasswordDialogueShown, setIsChangePasswordDialogueShown] = useState(false);
    const dispatch = useDispatch();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});

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

            {/*<SideBarBody isMobile={isMobile}*/}
            {/*             handleUserMenuButtonClick={handleUserMenuButtonClick}*/}
            {/*             location={location} />*/}



            <div className="col-sm-2 col-2 col-md-12 mt-md-5 pl-md-0 logo-col">
                <h4 id="logo" className={`pl-sm-3 pl-md-0 mt-md-4 sideBarItem `}>UnNotate</h4>
            </div>

            <div className="col-sm-2 col-2 col-md-12 mr-5 mt-md-auto user-menu-col ">

                {
                    // check if there is a user name  to show
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
                isUserMenuShown
                ?   <div className="userMenu ml-md-5">
                        <div onClick={handleUserMenuEntryClick} className="userMenuEntry text-nowrap">
                            Change password
                            <i className="far fa-key pl-md-3" />
                        </div>
                        <div onClick={handleUserMenuEntryClick}
                             className="userMenuEntry d-flex justify-content-between flex-grow-1 w-100">
                            Logout
                            <i className="far fa-sign-out pl-md-5" />
                        </div>
                    </div>
                :   null
            }

            {
                isChangePasswordDialogueShown
                ?   <ChangePasswordForm setIsChangePasswordDialogueShown={setIsChangePasswordDialogueShown} />
                :   null
            }
        </div>
    )

};

export default SideBar;