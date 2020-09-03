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
            <div className="viewPort container-fluid root-container w-100 p-0">
                <div className="row h-100 no-gutters" style={{ width: "97vw" }}>

                        {
                            !isScreenNarrow || isSidePanelOpen
                                ? <div className="col-md-2"><SidePanel /></div>
                                : null
                        }


                        {
                            isNoteOpen
                                ? isScreenNarrow
                                ? <div className="col-md-10"><Note /></div>
                                : <div className="col-md-10"><Note /></div>
                                : null
                        }

                    </div>
            </div>
        )
};

export default ViewPort;