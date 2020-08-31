import React from "react";

//import {useSelector} from "react-redux";

import SidePanel from "../SidePanel/SidePanel";
import Note from "./Note/Note";
import "./ViewPort.css"
import {useSelector} from "react-redux";
import {useMediaQuery} from "react-responsive/src";


const ViewPort = () => {
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});
    const isSidePanelOpen = useSelector(state => state.isSidePanelOpen);
    const isNoteOpen = useSelector(state => state.isNoteOpen);

    return (
            <div className="viewPort container-fluid root-container p-0">
                <div className="d-flex h-100">

                        {
                            !isScreenNarrow || isSidePanelOpen
                                ? <div className="w-19em"><SidePanel /></div>
                                : null
                        }


                        {
                            isNoteOpen
                                ? isScreenNarrow
                                ? <div className="w-100"><Note /></div>
                                : <div className="w-85"><Note /></div>
                                : null
                        }

                    </div>
            </div>
        )
};

export default ViewPort;