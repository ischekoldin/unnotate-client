import React from "react";

const SaveNoteButton = ({handleSaveNote, updateActiveNote}) => {

    return (

        <>
            {
                updateActiveNote

                    ?   <button className="btn m-0 h-100  btn-outline-light" type="button">
                            <div className="spinner-grow" role="status"  style={{ width: "1em", height: "1em" }} >
                                <span className="sr-only">...</span>
                            </div>
                        </button>

                    :   <button className="btn m-0 h-100 btn-outline-light"
                                type="button"
                                onClick={handleSaveNote}>

                        <i className="far fa-pencil-alt"/>
                        </button>
            }
        </>

    )

};

export default SaveNoteButton;