import * as React from 'react'
import reducer from '../reducers/reducer'

const initialState = {}

const Context = React.createContext({
    state: initialState,
    dispatch: undefined,
})

function ContextProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const { children } = props
    return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
}

const ContextConsumer = Context.Consumer

export { Context, ContextProvider, ContextConsumer }
