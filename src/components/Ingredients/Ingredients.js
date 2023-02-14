import React, {useCallback, useReducer, useEffect, useState, useMemo} from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import {apiURL} from "../../config";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorModal from "../UI/ErrorModal";
import {AppConstants} from "../../AppConstants";
import useHttp from "../hooks/http";

const {ADD, UPDATE, DELETE} = AppConstants;

const ingredientReducer = (state, action) => {
    switch (action.type) {
        case ADD:
            return [...state, action.payload]
        case UPDATE:
            return action.payload;
        case DELETE:
            console.log(action)
            return state.filter(item => item.id !== action.payload)
        default :
            throw new Error("Should pass a valid action type")
    }
}


const Ingredients = () => {
    const [keyword, setKeyword] = useState(undefined)
    const [state, dispatch] = useReducer(ingredientReducer, [])
    const {isLoading, error, data, sendRequest, returnBack} = useHttp()
    const loadData = useCallback((keyword = '') => {
        //httpDispatch({type:'SEND'})
        const queryParam = keyword.length !== 0 ? `?orderBy="title"&equalTo="${keyword}"` : '';
        fetch(`${apiURL}igredients.json${queryParam}`).then(res => res.json())
            .then(response => {
                dispatch({type: 'UPDATE', payload: Object.keys(response).map(item => ({...response[item], id: item}))})
                // setUserIngredients(Object.keys(response).map(item=>({...response[item],id:item})))
                //httpDispatch({type:'CLEAR'})
            })
            .catch(err => {
                //httpDispatch({type:'ERROR', payload:"Some error occurred"})
            })
    }, [])

    useEffect(() => {

    },[state])
    useEffect(() => {
        loadData(keyword);
    }, [keyword, loadData])
    useEffect(() => {
        dispatch({type: 'DELETE', payload: returnBack})
    }, [data, returnBack])

    const addIngredientHandler = useCallback((ingredient) => {
        sendRequest(`${apiURL}/igredients.json`, {
                method: 'POST',
                body: JSON.stringify(ingredient),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }, [sendRequest]);
    const removeIngredientHandler = useCallback((idToRemove) => {
        sendRequest(`${apiURL}igredients/${idToRemove}.json`, {method: 'DELETE'}, idToRemove)
    }, [sendRequest]);

    const ingredientListMemo = useMemo(() => {
        return <IngredientList ingredients={state} onRemoveItem={removeIngredientHandler}/>
    }, [state, removeIngredientHandler])
    const clearError = useCallback(() => {
        //httpDispatch({type:'CLEAR'})
    }, []);
    return (
        <div className="App">
            {(isLoading || error) && <div style={{
                position: 'absolute',
                background: 'rgba(255,255,255,0.8)',
                paddingBottom: '20%',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {isLoading && <LoadingIndicator/>}
                {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            </div>}
            {!error && <div>
                <IngredientForm onAddIngredient={addIngredientHandler}/>
                <section>
                    <Search refreshData={setKeyword}/>
                    {state && ingredientListMemo}
                </section>
            </div>}
        </div>

    );
};

export default Ingredients;
