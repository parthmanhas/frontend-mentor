import { createAction, props } from '@ngrx/store';

export const addBoard = createAction('[Board] Add Board');
export const deleteBoard = createAction('[Board] Delete Board');
export const addColumn = createAction('[Board] Add Column');
export const deleteColumn = createAction('[Board] Delete Column');