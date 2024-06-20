import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}
const chatSlice=createSlice({
    name: 'chatapp',
    initialState,
    reducers:{
        addNewProperties:(state,action)=>
        {
            return {...state,...action.payload}
        }
    }
});
export const {addNewProperties }=chatSlice.actions;
export const store = configureStore({
  reducer: {chatapp:chatSlice.reducer},
});

store.subscribe(()=>console.log(store.getState()));

