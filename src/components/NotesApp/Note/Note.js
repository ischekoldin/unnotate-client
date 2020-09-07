import React, {useCallback, useEffect, useRef, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill from "react-quill";

import "./quill.snow.css";
import "./Note.css"
import moment from "moment";
import {useMediaQuery} from "react-responsive/src";
import SaveNoteButton from "./SaveNoteButton/SaveNoteButton";
import NotesActionBar from "./NotesActionBar/NotesActionBar";

const Note = () => {

    const activeNote = useSelector(state => state.activeNote);
    const updateActiveNote = useSelector(state => state.updateActiveNote);
    const addNote = useSelector(state => state.addNote);
    const deleteNote = useSelector(state => state.deleteNote);
    const [noteTextTitle, setNoteTextTitle] = useState('');
    const dispatch = useDispatch();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});
    const quillRef = useRef();


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

            <NotesActionBar
                updateActiveNote={updateActiveNote}
                markActiveNoteForSaving={markActiveNoteForSaving}
                isScreenNarrow={isScreenNarrow}
                quillRef={quillRef}
                dispatch={dispatch}
            />

            <div id="toolbar" className="ql-toolbar">
                <span className="ql-formats">
                    <select className="ql-size" defaultValue="normal">
                        <option value="small">Small</option>
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                        <option value="huge">Huge</option>
                    </select>
                </span>
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
                ref={quillRef}
                style={{ height: '95vh', border: 'rgba(165, 169, 177, 0.5)', overflowX: "auto" }}
                value={noteTextTitle}
                onChange={setNoteTextTitle}
            />
        </div>
    )

};

export default Note;