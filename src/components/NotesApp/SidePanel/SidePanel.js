import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import "./SIdePanel.css";
import notesSearchNotesIcon from "./../../../images/icons/search-notes.png";
import {useMediaQuery} from "react-responsive/src";
import moment from "moment";

const SidePanel = () => {

    const notes = useSelector(state => state.notes);
    const dispatch = useDispatch();
    const activeNote = useSelector(state => state.activeNote);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const isScreenNarrow = useMediaQuery({query: '(max-width: 768px)'});
    const [isSearchShown, setIsSearchShown] = useState(false);
    const [sortBy, setSortBy] = useState('modified');



    const handleClick = (event) => {
        const note_id = parseInt(event.currentTarget.dataset.id);
        const noteToSetActive = notes.find(note => note.note_id === note_id);


        // if this note isn't active already
        if (activeNote.note_id !== noteToSetActive.note_id) {

            // make it active
            dispatch({
                type: 'notes/setActive',
                payload: noteToSetActive
            });
        }

        if (isScreenNarrow) {
            dispatch({
                type: 'responsiveness/isSidePanelOpen',
                payload: false
            });
            dispatch({
                type: 'responsiveness/isNoteOpen',
                payload: true
            });
        }


    };


    const handleSearch = (event) => {
        const searchValue = event.currentTarget.value.trim();

        setFilteredNotes(notes && notes.filter(
            note => note.note_text.includes(searchValue)));
    };

    const formatNote = (note) =>

        note.dateSegment && note.dateSegment
            ?   <div key={Math.random()} className="row">
                    <div className="col">
                        <div className="border pl-3 pt-2" style={{ backgroundColor: "rgb(221 221 229 / 50%)", height: "2.6em" }}>{note.dateSegment}</div>
                    </div>
                </div>
            :   <div className={
                /*highlight activeNote*/
                activeNote.note_id === note.entry.note_id
                    ? "sidePanelNoteWrapper active"
                    : "sidePanelNoteWrapper"
            }
                     key={note.entry.note_id}>

                <div className="sidePanelNote d-flex flex-row"
                     data-id={note.entry.note_id}
                     onClick={handleClick}>

                    {/*title of the note*/}
                    <div className="col-3 pt-0 h-100 border">
                        <div className="noteModified p-2 pt-3 pb-3 m-0 row">
                            <span className="m-0 date-day">{moment(note.entry.note_modified).format('D')}</span>
                            <span className="date-day-of-week">{moment(note.entry.note_modified).format('ddd').toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="col-9 border pl-3 pr-3 pt-2 pb-0">

                        <div className="row m-0">
                            <div className="noteTitle">{note.entry.note_title
                            //strip html tags
                                .replace(/<[^>]+>/g, "").substring(0, 21)}</div>
                        </div>

                        <div className="row m-0">
                        <span className="noteText" style={{ wordwrap: "break-all" }}>{note.entry.note_text
                        //strip html tags
                            .replace(/<[^>]+>/g, "").substring(0, 35)}...</span>
                        </div>
                    </div>
                </div>
            </div>;


    const sortNotes = (notes, sortBy) => {
        // can be sorted by creation or modification date


        if (sortBy === "created") {
            notes.sort((a, b) => {
                a = new Date(a.note_created);
                b = new Date(b.note_created);
                return (a === b) ? 0 : (a < b) ? 1 : -1
            });
        } else {
            notes.sort((a, b) => {
                a = new Date(a.note_modified);
                b = new Date(b.note_modified);
                return (a === b) ? 0 : (a < b) ? 1 : -1
            });
        }

    };

    const dateSegmentFormat = (note) => {
        return moment(note.note_created).format("MMM YYYY")
    };



    let notesToRender = [];

    if (filteredNotes && filteredNotes.length > 0) {
        notesToRender = filteredNotes;
    } else if (notes && notes.length > 0) {
        notesToRender = notes;
    }


    if (notesToRender && notesToRender.length > 0) {
        // copy state with notes
        let notesCopy = [...notes];

        sortNotes(notesCopy, sortBy);


        let notesCopyDates = [];

        for (let i = 0; i < notesCopy.length; i++) {
            let previousEntry;
            let currentEntry;
            if (i > 0) previousEntry = dateSegmentFormat(notesCopy[i - 1]);
            currentEntry = dateSegmentFormat(notesCopy[i]);
            if (i === 0 || previousEntry !== currentEntry) {
                notesCopyDates.push({
                    dateSegment: dateSegmentFormat(notesCopy[i])
                });
            }
            notesCopyDates.push({
                note_created: new Date(notesCopy[i].note_created),
                entry: notesCopy[i]
            });
        }

        notesToRender = notesCopyDates;

    }



    return (
        <div className="sidePanel h-100">

            {
                isSearchShown
                    ?   <div className="container mt-1 mb-2">
                            <div className="row">
                                <input
                                    type="text"
                                    className="notesSearch col-8 p-0"
                                    onChange={handleSearch}
                                    onBlur={() => setIsSearchShown(!isSearchShown)}
                                    placeholder="Search notes" />
                                <img className="notesSearchNotesIcon col-auto p-2" src={notesSearchNotesIcon} alt="search notes"/>
                            </div>
                        </div>

                    :   <div className="container mt-1 mb-2">
                            <div className="row">
                                <div className="col-9">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button"
                                                id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="false">
                                            Sort by: {sortBy}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <div className="dropdown-item" onClick={() => setSortBy('modified')}>Sort by: modified</div>
                                            <div className="dropdown-item" onClick={() => setSortBy('created')}>Sort by: created</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-3">
                                    <img className="notesSearchNotesIcon col-auto p-2"
                                         onClick={() => setIsSearchShown(!isSearchShown)}
                                         src={notesSearchNotesIcon}
                                         alt="search notes"
                                    />
                                </div>
                            </div>
                        </div>
            }


            <div className="container mr-0 pr-0 pl-0 mt-1">
                <div className="row ml-0" style={{ width: "19em" }}>
                    <div className="col pr-0 pl-0" style={{ overflowY: "auto", overflowX: "hidden", height: "59em"}}>
                        { notesToRender.map(note => formatNote(note)) }
                    </div>
                </div>

            </div>
        </div>
    )
};

export default SidePanel;