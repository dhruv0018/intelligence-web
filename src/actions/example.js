/*
    Action creators are exported using named exports.
*/
export const addTodo = text => (
    /*
        All action creators return an action, which is a plain JS object.
        This object can look like anything.
        The only requirement is that it contain a non-undefined type property
     */
    { type: 'ADD_TODO', text }
);

export const deleteTodo = id => ({ type: 'DELETE_TODO', id });

export const editTodo = (id, text) => ({ type: 'EDIT_TODO', id, text });

export const completeTodo = id => ({ type: 'COMPLETE_TODO', id });

export const completeAll = () => ({ type: 'COMPLETE_ALL' });

export const clearCompleted = () => ({ type: 'CLEAR_COMPLETED' });


export const addTodoAsync = () => {
    /*
        In order to do async actions we need to return a function.
        This function accepts a dispatch function as a param.
        The dispatch function is then called when our async action is completed
        In Redux terminology, the function returned here is called a 'thunk'
        A thunk is simply a function that wraps an expression to delay execution
    */
    return (dispatch, getState) => {
        setTimeout(() => {
            /*
                You can invoke sync or async actions with `dispatch`.
                Note also that actions can dispatch other actions
            */
            dispatch(addTodo());
        }, 1000);
    };
};

/*
    Here is an example of an action creator that uses a thunk to conditionally dispatch
 */
const conditionalAddTodo = () => {
    return (dispatch, getState) => {

        //only add a todo if we have less than ten todos
        if (getState().length > 10) {
            return;
        }

        dispatch(addTodo());
    };
};
