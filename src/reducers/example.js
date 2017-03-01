/*
    Reducers are initialized with an initialState.
    This object also serves as self-documentation
    for other devs to see the shape of this state slice
 */
const initialState = [
];

/*
    Each reducer file should only export one default function.
    This function takes in the current state and the triggered action.
    All reducer functions must be pure functions.
 */
export default function todos(state = initialState, action) {
    /*
        Reducer functions can look like anything
        but most take the shape of a switch statement
    */
    switch (action.type) {
        /* Traditionally these action types are kept in constants in their own file */
        case 'ADD_TODO':
            /*
                Each case must return a new state object.
                The state object cannot be modified directly
             */
            return [
                {
                    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
                    completed: false,
                    text: action.text
                },
                ...state
            ];

        case 'DELETE_TODO':
            return state.filter(todo =>
                todo.id !== action.id
            );

        case 'EDIT_TODO':
            return state.map(todo =>
                todo.id === action.id ?
                Object.assign(todo, { text: action.text }) :
                todo
            );

        case 'COMPLETE_TODO':
            return state.map(todo =>
                todo.id === action.id ?
                Object.assign(todo, { completed: !todo.completed }) :
                todo
            );

        case 'COMPLETE_ALL':
            const areAllMarked = state.every(todo => todo.completed);
            return state.map(todo => (
                Object.assign(todo, { completed: !areAllMarked })
            ));

        case 'CLEAR_COMPLETED':
            return state.filter(todo => todo.completed === false);

        /* Each reducer function must be able to handle defaults */
        default:
            return state;
    }
}
