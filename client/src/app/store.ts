import {configureStore} from '@reduxjs/toolkit';
import {workspaceReducer} from '../slices/workspaceSlice';
import {notesReducer} from '../slices/notesSlice';
import getRafDebounce from '../actions/rafDispatch';

const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        notesByMidi: notesReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export const dispatch = getRafDebounce(store.dispatch);
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;