import React from "react";

const SaveNoteButton = ({handleSaveNote, updateActiveNote}) => {

    return (

        <>
            {
                updateActiveNote

                    ?   <button className="btn m-0 pt-2 h-100 btn-just-icon btn-outline-light bg-transparent" type="button">
                            <div className="spinner-grow" role="status"  style={{ width: "1em", height: "1em" }} >
                                <span className="sr-only">...</span>
                            </div>
                        </button>

                    :   <button className="btn m-0 pt-2 h-100 btn-just-icon btn-outline-light bg-transparent"
                                type="button"
                                onClick={handleSaveNote}>

                        <i className="far fa-pencil-alt"/>
                        </button>
            }
        </>

    )

};

export default SaveNoteButton;