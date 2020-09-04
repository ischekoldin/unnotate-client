import React from "react";

const SideBarBody = ({handleUserMenuButtonClick, isMobile, location}) => {

    const mobileView = () =>
        <>
            <div className="col-sm-2 col-md-12 mt-md-5 pl-md-0 logo-col ">
                <h4 id="logo" className={"pl-sm-3 pl-md-0 mt-md-4 sideBarItem"}>UnNotate</h4>
            </div>

            <div className="col-sm-2 col-md-12 mt-md-auto user-menu-col">

                {
                    // check if there is a user name  to show
                    location && location.state && location.state.username
                    ?   <h4 className="userMenuButton sideBarItem"
                            onClick={handleUserMenuButtonClick}>
                                        <span className="text-nowrap">
                                            {location.state.username}
                                        </span>
                            <i className="far fa-angle-down" />
                        </h4>

                    :   <h4 className="sideBarItem"><span className="text-nowrap">Log in</span></h4>
                }

            </div>
        </>;


    const desktopView = () =>
        <>
            <div className="col-sm-2 col-md-12 mt-md-5 pl-md-0 logo-col ">
                <h4 id="logo" className={"pl-sm-3 pl-md-0 mt-md-4 sideBarItem"}>UnNotate</h4>
            </div>

            <div className="col-sm-2 col-md-12 mt-md-auto user-menu-col">

                {
                    // check if there is a user name  to show
                    location && location.state && location.state.username
                        ?   <h4 className="userMenuButton sideBarItem"
                                onClick={handleUserMenuButtonClick}>
                                        <span className="text-nowrap">
                                            {location.state.username}
                                        </span>
                            <i className="far fa-angle-down" />
                        </h4>

                        :   <h4 className="sideBarItem"><span className="text-nowrap">Log in</span></h4>
                }

            </div>
        </>;



    return (
        <>
            {isMobile ? mobileView : desktopView}
        </>
    )

};

export default SideBarBody;