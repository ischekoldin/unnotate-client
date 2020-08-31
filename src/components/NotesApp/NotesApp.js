import React, {useState, useEffect, useCallback} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import ViewPort from "./ViewPort/ViewPort";
import SideBar from "../SideBar/SideBar";
import moment from "moment";

import "./NotesApp.scss";
import {useMediaQuery} from "react-responsive/src";

const NotesApp = ({ location }) => {

    const [token, setToken] = useState((location.state && location.state.token) || '');
    const addNote = useSelector(state => state.addNote);
    const username = useSelector(state => state.user);
    const deleteNote = useSelector(state => state.deleteNote);
    const updateActiveNote = useSelector(state => state.updateActiveNote);
    const notesUpdateRequired = useSelector(state => state.updateRequired);
    const activeNote = useSelector(state => state.activeNote);
    const logout = useSelector(state => state.logout);
    const dispatch = useDispatch();
    const history = useHistory();
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});

    const CONFIG_FETCH_NOTES = {
        method: 'get',
        url: 'http://localhost:3000/notes',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const CONFIG_REFRESH_TOKEN = {
        method: 'get',
        url: 'http://localhost:3000/token',
    };





     const fetchNotes = useCallback(async () => {
         if (!addNote && !deleteNote && !updateActiveNote) {

             try {
                 //console.log('try fetch');
                 const notesRawData = await axios(CONFIG_FETCH_NOTES);
                 return notesRawData.data.rows;

             } catch (err) {
                  if (err.response && err.response.status === 403) {
                     //console.log('Catch');

                     axios(CONFIG_REFRESH_TOKEN).then((newAccessToken) => {
                         //console.log('Try refresh');
                         setToken(newAccessToken.data.accessToken);

                     });
                  }
                 return console.error(err.message);
             }
         }
     }, [CONFIG_FETCH_NOTES, CONFIG_REFRESH_TOKEN, addNote, deleteNote, updateActiveNote]);

    const addNewNote = useCallback(async () => {
        const noteTitle = '<p>New note</p>';
        const noteText = ' ';
        const noteOwnerName = username ? username : location.state.username;
        const noteCreatedTime = moment().format("YYYY-MM-DD HH:mm:ss");


        const CONFIG_ADD_NEW_NOTE = {
            method: 'post',
            url: 'http://localhost:3000/notes/add',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {noteTitle: noteTitle,
                noteText: noteText,
                noteOwnerName: noteOwnerName,
                noteCreatedTime: noteCreatedTime,
                noteModifiedTime: noteCreatedTime}
        };

        try {
            await axios(CONFIG_ADD_NEW_NOTE);
            dispatch({
                type: 'notes/add',
                payload: false
            });

        } catch (err) {
            dispatch({
                type: 'notes/add',
                payload: false
            });
            console.error(err.message);
        }

    }, [dispatch, token, username, location.state.username]);


    const deleteActiveNote = useCallback(async () => {

        const CONFIG_DELETE_ACTIVE_NOTE = {
            method: 'post',
            url: 'http://localhost:3000/notes/delete',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {noteId: activeNote.note_id}
        };

        try {
            await axios(CONFIG_DELETE_ACTIVE_NOTE);
            dispatch({
                type: 'notes/delete',
                payload: false
            });
            dispatch({
                type: 'notes/clearActiveNote',
            });
        } catch (err) {
            // dispatch({
            //     type: 'notes/delete',
            //     payload: false
            // });
            console.error(err.message);
        }

    }, [dispatch, activeNote, token]);





    useEffect(() => {
        fetchNotes().then((result) => {
            // only fetch notes from backend if not syncing local state of the editor with
            // its state in Redux
            if (result && !updateActiveNote) {
                dispatch({
                    type: 'notes/fetch',
                    payload: result
                });

                // recover user name if lost on refresh
                if (!username) {
                    dispatch({
                        type: 'user/set',
                        payload: location.state.username
                    });
                }

            }

            setTimeout(() => {
                dispatch({
                    type: 'notes/updateActiveNote',
                    payload: false
                })
            }, 1000);

        });
     },
        [
        deleteNote,
        addNote,
        dispatch,
        fetchNotes,
        updateActiveNote,
        username,
        notesUpdateRequired,
        location.state.username
        ]
    );


    const saveActiveNote = useCallback(async () => {

        const CONFIG_SAVE_ACTIVE_NOTE = {
            method: 'post',
            url: 'http://localhost:3000/notes/save_active',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {activeNote: activeNote}
        };

        try {
            axios(CONFIG_SAVE_ACTIVE_NOTE);


        } catch (err) {
            // dispatch({
            //     type: 'notes/updateActiveNote',
            //     payload: false
            // });
            console.error(err.message);
        }

    }, [dispatch, activeNote, token]);


    const logOut = useCallback(async () => {

        const CONFIG_LOGOUT = {
            method: 'delete',
            url: 'http://localhost:3000/logout',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        };

        try {
            await axios(CONFIG_LOGOUT);
            dispatch({
                type: 'auth/logout',
                payload: false
            });
            setToken('');
            history.push({
                pathname: "/"
            });
        } catch (err) {
            console.error(err.message);
        }

    }, [token]);


    if (!isScreenNarrow) {
        dispatch({
            type: 'responsiveness/isNoteOpen',
            payload: true
        });
    }

    useEffect(() => {
        if (addNote) {
            addNewNote();
        }
    },[addNote, addNewNote]);


    useEffect(() => {
        if (deleteNote) {
            deleteActiveNote();
        }
    },[deleteNote, deleteActiveNote]);


    useEffect(() => {
        // check if activeNote has been changed by editing a note,
        // not by switching to another one which would overwrite one by the other
        if (updateActiveNote) {
                // upload the edited note to DB
                saveActiveNote();
        }
    }, [saveActiveNote, updateActiveNote]);

    useEffect(() => {
        if (logout) {
            logOut();
        }
    },[logout, logOut]);

    if (!token) {
        history.push('/')
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex">
                    <div className="flex-fill m-0 p-0">
                        <SideBar location={location} />
                    </div>
                    <div className="flex-fill pl-0 ml-0 w-100">
                        <ViewPort />
                    </div>
            </div>
        </div>
    )

};

export default NotesApp;
