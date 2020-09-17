import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import "./SidePanel.css";
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



    const handleNoteClick = (event) => {
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
            note => note.note_text.match(new RegExp(searchValue, "i"))));
    };


    const sortNotes = (notes, sortBy) => {
        // notes can be sorted by

        // creation
        if (sortBy === "created") {
            notes.sort((a, b) => {
                a = new Date(a.note_created);
                b = new Date(b.note_created);
                return (a === b) ? 0 : (a < b) ? 1 : -1
            });

        // or modification date
        } else {
            notes.sort((a, b) => {
                a = new Date(a.note_modified);
                b = new Date(b.note_modified);
                return (a === b) ? 0 : (a < b) ? 1 : -1
            });
        }

    };



    const insertDateSegments = (notesCopy) => {

        // assuming the array with notes is sorted by date
        // insert a date like "January 2020" when loop comes across a new month
        const dateSegmentFormat = (note) => {

            if (sortBy === 'created') return moment(note.note_created).format("MMM YYYY");

            if (sortBy === 'modified') return moment(note.note_modified).format("MMM YYYY");

        };

        let notesCopyDates = [];
        for (let i = 0; i < notesCopy.length; i++) {

            let previousEntry;
            let currentEntry;

            if (i > 0) previousEntry = dateSegmentFormat(notesCopy[i - 1]);
            currentEntry = dateSegmentFormat(notesCopy[i]);

            if (i === 0 || previousEntry !== currentEntry || !previousEntry) {
                notesCopyDates.push({
                    dateSegment: dateSegmentFormat(notesCopy[i])
                });
            }

            notesCopyDates.push({
                note_created: new Date(notesCopy[i].note_created),
                entry: notesCopy[i]
            });
        }

        return notesCopyDates;
    };


    const toggleSearchBox = () => {
        setIsSearchShown(!isSearchShown);
    };


    let notesToRender;

    // check if there is a search filter
    if (filteredNotes && filteredNotes.length > 0) {

        notesToRender = filteredNotes;

    } else if (notes && notes.length > 0) {

        notesToRender = notes;

    }


    if (notesToRender && notesToRender.length > 0) {

        // copy state with notes
        let notesCopy = [...notesToRender];

        // sort by date
        sortNotes(notesCopy, sortBy);

        // insert a date before each new month in the list
        notesToRender = insertDateSegments(notesCopy);

    }




    const formatNote = (note) =>
        // the "note" entry can either be
        note.dateSegment && note.dateSegment

            // a segment with month and date
            ?   <li key={note.dateSegment} className="d-flex flex-grow-1 notes_list__date_segment">
                    <span className="pl-3 pt-2">{note.dateSegment}</span>
                </li>

            // or an actual note
            :   <li className={
                // highlight activeNote
                activeNote.note_id === note.entry.note_id
                    ? "side-panel-note-wrapper active"
                    : "side-panel-note-wrapper"
            }
                     key={note.entry.note_id}>

                <div className="side-panel-note d-flex flex-row"
                     data-id={note.entry.note_id}
                     onClick={handleNoteClick}>

                    {/*title of the note*/}
                    <div className="col-3 pt-0 h-100 border">
                        <div className="note-modified p-2 pt-3 pb-3 m-0 row">
                            <span className="m-0 date-day">{moment(note.entry.note_modified).format('D')}</span>
                            <span className="date-day-of-week">{moment(note.entry.note_modified).format('ddd').toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="col-9 border pl-3 pr-3 pt-2 pb-0">

                        <div className="row m-0">
                            <div className="note-title">{note.entry.note_title
                            //strip html tags
                                .replace(/<[^>]+>/g, "").substring(0, 21)}</div>
                        </div>

                        <div className="row m-0">
                            <span className="note-text" style={{ wordwrap: "break-all" }}>{note.entry.note_text
                            //strip html tags
                                .replace(/<[^>]+>/g, "").substring(0, 35)}...</span>
                        </div>
                    </div>
                </div>
            </li>;


    return (
        <div className="side-panel h-100">

            {
                // show either a search box
                isSearchShown
                    ?   <div className="notes-search-container">
                            <input
                                type="text"
                                className="notes-search"
                                onChange={handleSearch}
                                onBlur={toggleSearchBox}
                                placeholder="Search notes" />

                            <div className="search-button-container" onClick={toggleSearchBox}>
                                <i className="far fa-search"/>
                            </div>

                        </div>

                    // of a "sort by" dropdown list
                    :   <div className="notes-search-container">
                            <div className="dropdown">
                                <button className="btn dropdown-toggle" type="button"
                                        id="dropdown-menu-button" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    Sort by: {sortBy}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <div className="dropdown-item" onClick={() => setSortBy('modified')}>Sort by: modified</div>
                                    <div className="dropdown-item" onClick={() => setSortBy('created')}>Sort by: created</div>
                                </div>
                            </div>

                            <div className="search-button-container" onClick={toggleSearchBox}>
                                <i className="far fa-search"/>
                            </div>
                        </div>
            }

            {/*actual list of notes*/}

                <div className="ml-0 notes-list-container">
                    <ul className="pr-0 pl-0 notes-list">
                        {notesToRender && notesToRender.map(note => formatNote(note)) }
                    </ul>
                </div>


        </div>
    )
};

export default SidePanel;