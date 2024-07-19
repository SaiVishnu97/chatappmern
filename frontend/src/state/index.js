import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mychats:[],
    frienduser:null,
    isGroupChatSelected: false,
    groupchatdata:null,
    currentchatid:null
}
const chatSlice=createSlice({
    name: 'chatapp',
    initialState,
    reducers:{
        addNewProperties:(state,action)=>
        {
            return {...state,...action.payload};
        },
        removeProperties:(state,action)=>{
            const newstate=state;
            delete newstate[action.payload];
            return newstate;
        },
        addNewChats:(state,action)=>{
            const ifalreadypresent = state.mychats.find((val) => val._id === action.payload._id);
      if (!ifalreadypresent) {
        state.mychats.push(action.payload);
      }
        },
        updateChatData:(state,action)=>{
            const chatindex=state.mychats.findIndex(val=>val._id===action.payload._id);
            state.mychats[chatindex]=action.payload;
        }
        
    }
});
export const {addNewProperties,removeProperties,addNewChats,updateChatData }=chatSlice.actions;
export const store = configureStore({
  reducer: {chatapp:chatSlice.reducer},
});

store.subscribe(()=>console.log(store.getState()));

