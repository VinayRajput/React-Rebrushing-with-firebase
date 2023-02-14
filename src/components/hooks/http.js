import {useCallback, useReducer} from "react";
import {AppConstants } from "../../AppConstants";
const {ADD, UPDATE, DELETE, SEND, RESPONSE, CLEAR, ERROR} = AppConstants;

const httpReducer = (state, action) => {
    switch (action.type) {
        case SEND:
            console.log(action)
            return {...state, loading: true, error: null, returnBack:action.returnBack}
        case RESPONSE:
            return {...state, loading: false, error: null, data: action.response}
        case CLEAR:
            return {...state, loading: false, error: null}
        case ERROR:
            return {...state, loading: false, error: action.payload}
        default:
            return new Error('Please provide correct type of http action');
    }
}

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, {loading: false, error: null, data: null, sendRequest:()=>{}, returnBack:null});
    const sendRequest = useCallback( (url, options ,returnBack) => {
        httpDispatch({type: 'SEND', returnBack:returnBack})
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        })
        .then(res => res.json())
        .then((response) => {
            httpDispatch({type: 'RESPONSE', responseData: response})
        })
        .catch(err => {
            httpDispatch({type: 'ERROR', payload: "Some error occurred"})
        })
    },[]);
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest:sendRequest,
        returnBack:httpState.returnBack
    }
}

export default useHttp;