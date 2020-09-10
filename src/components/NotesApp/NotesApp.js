import React, {useState, useEffect, useCallback} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Container from "./Container/Container";
import SideBar from "../SideBar/SideBar";
import moment from "moment";

import "./NotesApp.scss";
import {useMediaQuery} from "react-responsive/src";

const NotesApp = ({ location }) => {

    const ENDPOINT = useSelector(state => state.endpoint);
    const [token, setToken] = useState((location.state && location.state.token) || '');
    const isTokenRefreshRequired = useSelector(state => state.tokenRefreshRequired);
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
        url: `${ENDPOINT}/notes`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const CONFIG_REFRESH_TOKEN = {
        method: 'get',
        url: `${ENDPOINT}/token`,
        withCredentials: true
    };


    const updateUserName = useCallback ( () => {

        // recover user name if lost on refresh
        if (!username) {
            dispatch({
                type: 'user/set',
                payload: location.state.username
            });
        }

    },[username, dispatch, location.state.username]);


    const refreshToken = useCallback (async () => {

        try {
            const newAccessToken = await axios(CONFIG_REFRESH_TOKEN);
            //await console.info(`New token ${newAccessToken}`);
            await setToken(newAccessToken.data.accessToken);
            await dispatch({
                type: 'auth/tokenRefreshRequired',
                payload: false
            });
        } catch (err) {
            console.error(err.message);
        }

    },[CONFIG_REFRESH_TOKEN, dispatch]);



     const fetchNotes = useCallback(async () => {
         if (!addNote && !deleteNote && !updateActiveNote) {

             try {
                 //console.log('try fetch');
                 const notesRawData = await axios(CONFIG_FETCH_NOTES);
                 return notesRawData.data.rows;

             } catch (err) {
                  if (err.response && err.response.status === 403) {

                      dispatch({
                          type: 'auth/tokenRefreshRequired',
                          payload: true
                      });

                  }
                 return console.error(err.message);
             }
         }
     }, [CONFIG_FETCH_NOTES, addNote, deleteNote, updateActiveNote, dispatch]);

    const addNewNote = useCallback(async () => {
        const noteTitle = '<p>New note</p>';
        const noteText = ' ';
        const noteOwnerName = username ? username : location.state.username;
        const noteCreatedTime = moment().format("YYYY-MM-DD HH:mm:ss");


        const CONFIG_ADD_NEW_NOTE = {
            method: 'post',
            url: `${ENDPOINT}/notes/add`,
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
            if (err.response && err.response.status === 403) {
                //console.log('Catch');

                dispatch({
                    type: 'auth/tokenRefreshRequired',
                    payload: true
                });

            }
            console.error(err.message);
        }

    }, [dispatch, token, username, location.state.username, ENDPOINT]);


    const deleteActiveNote = useCallback(async () => {

        const CONFIG_DELETE_ACTIVE_NOTE = {
            method: 'post',
            url: `${ENDPOINT}/notes/delete`,
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
            if (err.response && err.response.status === 403) {
                //console.log('Catch');

                dispatch({
                    type: 'auth/tokenRefreshRequired',
                    payload: true
                });

            }
            console.error(err.message);
        }

    }, [dispatch, activeNote, token, ENDPOINT]);


    useEffect(() => {
        updateUserName();
    },[updateUserName]);


    useEffect(() => {
        if (isTokenRefreshRequired) {
            refreshToken();
        }
    },[isTokenRefreshRequired]);


    useEffect(() => {
        fetchNotes().then((result) => {
            // only fetch notes from backend if not syncing local state of the editor with
            // its state in Redux
            if (result && !updateActiveNote) {
                dispatch({
                    type: 'notes/fetch',
                    payload: result
                });

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
        fetchNotes,
        updateActiveNote,
        notesUpdateRequired,
        ]
    );




    const saveActiveNote = useCallback(async () => {

        const CONFIG_SAVE_ACTIVE_NOTE = {
            method: 'post',
            url: `${ENDPOINT}/notes/save_active`,
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

    }, [activeNote, token, ENDPOINT]);


    const logOut = useCallback(async () => {

        const CONFIG_LOGOUT = {
            method: 'delete',
            url: `${ENDPOINT}/logout`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
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

    }, [token, ENDPOINT, dispatch, history]);


    if (!isScreenNarrow) {
        dispatch({
            type: 'responsiveness/isNoteOpen',
            payload: true
        });
    }

    if (location.state.rememberMe === true) {
        document.cookie = "unnotateRememberMe=true";
    } else if (location.state.rememberMe === false) {
        document.cookie = "unnotateRememberMe=false";
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
        refreshToken().then(history.push('/notes')).catch(history.push('/'));

    }

    return (

            <div className="row no-gutters h-100">
                <div className="col-md-1 col-sm-12 sideBarContainer" style={{flex: "0 0 2.1%"}}>
                    <SideBar location={location} />
                </div>
                <div className="col-md-9 col-sm-12 pl-0 ml-0 h-100 flex-grow-1">
                    <Container />
                </div>
            </div>


    )

};

export default NotesApp;
