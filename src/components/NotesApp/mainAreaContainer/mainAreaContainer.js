import React from "react";

//import {useSelector} from "react-redux";

import SidePanel from "../SidePanel/SidePanel";
import Note from "../Note/Note";
import "./mainAreaContainer.css"
import {useSelector} from "react-redux";
import {useMediaQuery} from "react-responsive/src";


const MainAreaContainer = () => {
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});
    const isSidePanelOpen = useSelector(state => state.isSidePanelOpen);
    const isNoteOpen = useSelector(state => state.isNoteOpen);

    return (
            <div className="mainAreaContainer h-100 p-0">
                <div className="d-flex h-100 w-100">

                        {
                            !isScreenNarrow || isSidePanelOpen
                                ? <div className="flex-grow-0 h-100" style={{ width: "19em" }}><SidePanel /></div>
                                : null
                        }



<div className="flex-grow-1 flex-shrink-1 h-100"><Note /></div>



                    </div>
            </div>
        )
};

export default MainAreaContainer;