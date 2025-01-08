import React, {useReducer , createContext} from 'react';
import AppReducer from './AppReducer';
const initialState = {
    transactions: []
    
}


const globalContext = createContext(initialState)
export default globalContext;



export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //actions
    function deleteTransaction(id){
        dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id
        })
    }

    function addTransaction(transaction){
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: transaction
        })
    }

    return (
        <globalContext.Provider value={{transactions: state.transactions,deleteTransaction,addTransaction}}>
            {children}
        </globalContext.Provider>
    )
}