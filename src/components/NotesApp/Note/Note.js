import React, {useCallback, useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill from "react-quill";

import "./quill.snow.css";
import "./Note.css"
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
        "color",
        "align",
        "script"
    ];


    return (
        <div className="activeNote h-100 d-flex flex-column">
            <div className="d-flex flex-row" style={{ height: "3rem" }}>
                <div className="d-flex flex-row m-0 mr-5 flex-grow-1" style={{ height: "3rem" }}>
                    <div className="" style={{ height: "3rem" }}>

                            {isScreenNarrow
                                ?   <button className="openSidePanelBtn btn btn-secondary"
                                            onClick={handleSidePanelOpen}>
                                            <i className="far fa-arrow-left" />
                                    </button>
                                :   ""
                            }

                            <button type="button" className="btn btn-outline-light  bg-transparent pr-2">
                                <i className="far fa-undo" />
                            </button>
                            <button type="button" className="btn btn-outline-light bg-transparent">
                                <i className="far fa-redo" />
                            </button>

                    </div>
                    <div className="ml-auto" style={{ height: "3rem" }}>

                        <div className="d-flex justify-content-end m-0">
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
                <select title="Size" className="ql-size" defaultValue="13px">
                    <option value="10px">Small</option>
                    <option value="13px">Normal</option>
                    <option value="18px">Large</option>
                    <option value="32px">Huge</option>
                </select>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered" />
                    <button className="ql-list" value="bullet" />
                </span>
                <span className="ql-formats mr-1">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />
                </span>
                <span className="ql-formats">
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
                    <select className="ql-align mr-1" defaultValue="left">
                        <option value="" className="ql-align-left" />
                        <option value="center" className="ql-align-center" />
                        <option value="right" className="ql-align-right" />
                        <option value="justify" className="ql-align-justify" />
                    </select>
                </span>
                <span className="ql-formats mr-0">
                  <button className="ql-script" value="sub" />
                  <button className="ql-script" value="super" />
                </span>
            </div>

            {
                activeNote && activeNote.note_created
                    ?   <div className="d-flex position-absolute editor-note-created flex-grow-1">
                            <div className="border-bottom pl-0"
                                 style={{ fontSize: "0.8em", zIndex: "70" }}>
                                Note created {moment(activeNote.note_created).format("MMM D yyyy")}
                            </div>
                        </div>

                :   null
            }

            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                style={{ height: '95vh', border: 'rgba(165, 169, 177, 0.5)', overflowX: "auto" }}
                value={noteTextTitle}
                onChange={setNoteTextTitle}
            />
        </div>
    )

};

export default Note;