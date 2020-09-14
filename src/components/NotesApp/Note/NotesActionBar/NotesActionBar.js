import SaveNoteButton from "../SaveNoteButton/SaveNoteButton";
import React from "react";

const NotesActionBar = (
    {
        quillRef,
        markActiveNoteForSaving,
        isScreenNarrow,
        updateActiveNote,
        dispatch
    }) => {


    const handleDeleteNote = () => {
        dispatch({
            type: 'notes/delete',
            payload: true
        });
    };

    const handleAddNewNote = () => {
        dispatch({
            type: 'notes/add',
            payload: true
        });
    };

    const handleSaveNote = () => {
        markActiveNoteForSaving();
    };

    const handleSidePanelOpen = () => {
        dispatch({
            type: 'responsiveness/isSidePanelOpen',
            payload: true
        });
        dispatch({
            type: 'responsiveness/isNoteOpen',
            payload: false
        });
    };

    const editorUndo = () => {
        quillRef.current.editor.history.undo();
    };

    const editorRedo = () => {
        quillRef.current.editor.history.redo();
    };


    return (

            <div className="d-flex flex-row flex-grow-1 side-bar">
                <div className="d-flex align-items-center side-bar">

                    {isScreenNarrow
                        ?   <button className="openSidePanelBtn btn btn-secondary"
                                    onClick={handleSidePanelOpen}>
                            <i className="far fa-arrow-left" />
                        </button>
                        :   ""
                    }

                    <button type="button" className="btn btn-outline-light  bg-transparent pr-2" onClick={editorUndo}>
                        <i className="far fa-undo" />
                    </button>
                    <button type="button" className="btn btn-outline-light bg-transparent" onClick={editorRedo}>
                        <i className="far fa-redo" />
                    </button>

                </div>
                <div className="ml-auto d-flex align-items-center side-bar">

                    <div className="d-flex justify-content-end align-content-center m-0">
                        <div className="">

                            <SaveNoteButton
                                updateActiveNote={updateActiveNote}
                                handleSaveNote={handleSaveNote}
                            />

                            <button className="btn m-0 pt-2 h-100 btn-just-icon btn-outline-light bg-transparent"
                                    type="button"
                                    onClick={handleDeleteNote}>

                                <i className="far fa-trash" />
                            </button>

                        </div>

                        <button className="btn btn-primary ml-2 mr-1"
                                id="addNoteBtn"
                                type="button"
                                onClick={handleAddNewNote}>
                            <i className="far fa-plus" />
                        </button>
                    </div>
                </div>
            </div>
    )

};

export default NotesActionBar;