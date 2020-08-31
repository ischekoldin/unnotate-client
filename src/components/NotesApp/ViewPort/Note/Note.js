import React, {useCallback, useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill from "react-quill";

import "./quill.snow.css";
import "./Note.css"
import deleteNoteIcon from "./../../../../images/icons/delete-note-bold.png";
import moment from "moment";
import {useMediaQuery} from "react-responsive/src";
import SaveNoteButton from "./SaveNoteButton/SaveNoteButton";

const Note = () => {

    const activeNote = useSelector(state => state.activeNote);
    const updateActiveNote = useSelector(state => state.updateActiveNote);
    const addNote = useSelector(state => state.addNote);
    const deleteNote = useSelector(state => state.deleteNote);
    const [noteTextTitle, setNoteTextTitle] = useState('');
    const dispatch = useDispatch();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});


    // if note is edited, send the new version to Redux store
    const markActiveNoteForSaving = useCallback(async () => {
        let noteArray = noteTextTitle.match(/<p>.*?<\/p>/);
        if (noteArray && !updateActiveNote && !addNote && !deleteNote && (noteTextTitle !== activeNote.note_title + activeNote.note_text)) {

            const noteTitle = noteArray[0];
            const noteTitleLength = noteTitle.length;
            const noteText = noteTextTitle.slice(noteTitleLength);

            // new data receives the same object structure as received from backend
            const formattedNote = {
                note_id: activeNote.note_id,
                note_title: noteTitle,
                note_created: activeNote.note_created,
                note_modified: moment().format("YYYY-MM-DD HH:mm:ss"),
                note_text: noteText,
                note_owner_name: activeNote.note_owner_name
            };

            dispatch({
                type: 'notes/setActive',
                payload: formattedNote
            });

            dispatch({
                type: 'notes/updateActiveNote',
                payload: true
            });

        }
    },[
        noteTextTitle,
        activeNote.note_created,
        activeNote.note_id,
        activeNote.note_modified,
        activeNote.note_owner_name,
        activeNote.note_text,
        activeNote.note_title,
        dispatch,
        updateActiveNote,
        addNote,
        deleteNote
    ]);

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

    // sync activeNote in global Redux store with local state inside component
    useEffect(() => {
        if (activeNote.note_title) {
            setNoteTextTitle(`${activeNote.note_title}${activeNote.note_text}`);
        } else {
            setNoteTextTitle('');
        }
    },[activeNote]);


    // the edited note needs to be saved
    useEffect(() => {
        const timeout = setTimeout(() => {
            // upload the edited note to DB
            markActiveNoteForSaving();
        }, 3000);
        return () => clearTimeout(timeout);

    },[noteTextTitle]);





    const modules = {
        toolbar: {
            container: "#toolbar",
        },
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color"
    ];



    return (
        <div className="activeNote h-100">
            <div className="container-fluid p-0" style={{ height: "3rem" }}>
                <div className="row justify-content-between m-0">
                    <div className="col-2">
                        <div className="btn-toolbar offset-2 h-100">
                            <button type="button" className="btn btn-outline-light btn-just-icon bg-transparent pr-4">
                                <i className="far fa-chevron-left" />
                            </button>
                            <button type="button" className="btn btn-outline-light bg-transparent">
                                <i className="far fa-chevron-right" />
                            </button>
                        </div>
                    </div>
                    <div className="col-6 h-auto">

                        <div className="row justify-content-end m-0">
                            <div className="col-2">

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

                            <div className="col-1">
                                <button className="btn btn-primary m-0 pt-1 btn-just-icon"
                                                         id="addNoteBtn"
                                                         type="button"
                                                         onClick={handleAddNewNote}>
                                    <i className="fas fa-plus" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="toolbar">
                {isScreenNarrow ? <button className="openSidePanelBtn btn btn-secondary" onClick={handleSidePanelOpen}>o</button> : null}


                <select title="Size" className="ql-size" defaultValue="13px">
                    <option value="10px">Small</option>
                    <option value="13px">Normal</option>
                    <option value="18px">Large</option>
                    <option value="32px">Huge</option>
                </select>
                |
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />


                <button className="ql-bold" ><img className="toolBarBtnIcon" src={deleteNoteIcon} alt="add note" /></button>
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-strike" />
                <select className="ql-color">
                    <option value="rgb(0, 0, 0)"/>
                    <option value="rgb(230, 0, 0)"/>
                    <option value="rgb(255, 153, 0)"/>
                    <option value="rgb(255, 255, 0)"/>
                    <option value="rgb(0, 138, 0)"/>
                    <option value="rgb(0, 102, 204)"/>
                    <option value="rgb(153, 51, 255)"/>
                    <option value="rgb(255, 255, 255)"/>
                    <option value="rgb(250, 204, 204)"/>
                    <option value="rgb(255, 235, 204)"/>
                    <option value="rgb(204, 224, 245)"/>
                    <option value="rgb(235, 214, 255)"/>
                    <option value="rgb(187, 187, 187)"/>
                    <option value="rgb(102, 185, 102)"/>
                </select>

                <span className="ql-formats">
                  <button className="ql-script" value="sub"></button>
                  <button className="ql-script" value="super"></button>
                </span>


                <select className="ql-align">
                    <option value="right" className="ql-align-right" />
                    <option value="center" className="ql-align-center" />
                </select>

            </div>

            {
                activeNote && activeNote.note_created
                    ?   <div className="row position-absolute mt-3 ml-4">
                            <div className="col-auto border-bottom offset-3 pl-0"
                                 style={{ fontSize: "0.8em", zIndex: "70" }}>
                                Note created {moment(activeNote.note_created).format("MMM d yyyy")}
                            </div>
                        </div>

                :   null
            }

            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                style={{ height: '95%', border: 'rgba(165, 169, 177, 0.5)' }}
                value={noteTextTitle}
                onChange={setNoteTextTitle}
            />
        </div>
    )

};

export default Note;