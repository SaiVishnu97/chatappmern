import { configureStore ,createSlice} from '@reduxjs/toolkit'
import { Chat, ClientToServerEvents, ServerToClientEvents, User } from 'CommonTypes'
import { useStore } from 'react-redux'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Socket } from 'socket.io-client'

  

export type InitialStateType={
    mychats:Chat[]
    frienduser:User | null,
    isGroupChatSelected: boolean,
    groupchatdata:Chat | null,
    currentchat:null | Chat,
    messagereceived: boolean,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
}
const initialState:Partial<InitialStateType> = {
    mychats:undefined,
    frienduser:null,
    isGroupChatSelected: false,
    groupchatdata:null,
    currentchat:null,
    messagereceived: false,
    socket: undefined
}

const chatSlice=createSlice({
    name: 'chatapp',
    initialState,
    reducers:{
        addNewProperties:(state,action)=>
        {
            return {...state,...action.payload};
        },
        removeProperties:(state,action:{payload:string,type:string})=>{
            const newstate=state;
            type removedproptype=keyof InitialStateType
            if(action.payload)
            delete newstate[action.payload as removedproptype];
            return newstate;
        },
        addNewChats:(state,action:{type:string,payload: Chat})=>{
           if(state.mychats){
            const ifalreadypresent = state.mychats.find((val) => val._id === action.payload._id);
      if (!ifalreadypresent) {
        state.mychats.push(action.payload);
      }
    }
        },
        updateChatData:(state,action:{type:string,payload: Chat})=>{
            if(state.mychats){
            const chatindex=state.mychats.findIndex(val=>val._id===action.payload._id);
            state.mychats[chatindex]=action.payload;
            }
        },
        reShuffleMyChats:(state,action:{type:string,payload: Chat})=>{
            if(state.mychats){
            const chatindex=state.mychats.findIndex(val=>val._id===action.payload._id);
            const currentstatechats=JSON.parse(JSON.stringify(state.mychats))
            let selectedChat=action.payload;

            if(chatindex!==-1)
            {
              currentstatechats.splice(chatindex,1);
            }
            
            currentstatechats.unshift(selectedChat);
            state.mychats=currentstatechats;
        }
        },
        reShuffleMyChatsAfterDeletion:(state,action:{type:string,payload: Chat})=>{
            if(state.mychats)
            {
                const chatindex=state.mychats.findIndex(val=>val._id===action.payload._id);
                const currentstatechats=JSON.parse(JSON.stringify(state.mychats))
                if(chatindex!==-1)
                  currentstatechats.splice(chatindex,1);
                
                state.mychats=currentstatechats;
            }
        }
        
    }
});
export const {addNewProperties,removeProperties,addNewChats,updateChatData,reShuffleMyChats,reShuffleMyChatsAfterDeletion }=chatSlice.actions;
export const store = configureStore({
  reducer: {chatapp:chatSlice.reducer},
});
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']


export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore
store.subscribe(()=>console.log(store.getState()));

