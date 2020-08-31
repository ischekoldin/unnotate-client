
const initialState = {
    notes: [],
    updateRequired: false,
    activeNote: {},
    updateActiveNote: false,
    addNote: false,
    deleteNote: false,
    user: '',
    logout: false,
    isNoteOpen: true,
    isSidePanelOpen: false // if true by default, querying the screen size doesn't work properly
};

function rootReducer (state = initialState, action) {
    switch (action.type) {
        case 'notes/fetch':
            return { ...state, notes: action.payload };
        case 'notes/updateRequired':
            return { ...state, updateRequired: action.payload };
        case 'notes/setActive':
            return { ...state, activeNote: action.payload };
        case 'notes/add':
            return { ...state, addNote: action.payload };
        case 'notes/updateActiveNote':
            return { ...state, updateActiveNote: action.payload };
        case 'notes/clearActiveNote':
            return { ...state, activeNote: {} };
        case 'notes/delete':
            return { ...state, deleteNote: action.payload };
        case 'user/set':
            return { ...state, user: action.payload };
        case 'auth/logout':
            return { ...state, logout: action.payload };
        case 'responsiveness/isNoteOpen':
            return { ...state, isNoteOpen: action.payload };
        case 'responsiveness/isSidePanelOpen':
            return { ...state, isSidePanelOpen: action.payload };
        default:
            return state;
    }
}

export default rootReducer;