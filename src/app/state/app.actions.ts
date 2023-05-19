import { createAction, props } from '@ngrx/store';
import { Board, Column, Subtask, Task } from './app.state';

// application actions
export const changeTheme = createAction('[Sidebar] Change Theme', props<{ theme: string }>());

// board actions
export const addBoard = createAction('[Board] Add Board', props<{ board: Board }>());
export const deleteBoard = createAction('[Board] Delete Board', props<{ board: Board }>());
export const editBoard = createAction('[Board] Edit Board', props<{ board: Board }>());
export const selectBoard = createAction('[Board] Select Board', props<{ boardName: string }>());
export const createBoardModalVisible = createAction('[Board] Display create board modal', props<{ createBoardModalVisible: boolean }>());

// sidebar actions
export const toggleSidebar = createAction('[Sidebar] Toggle Sidebar', props<{ sidebarVisible: boolean }>());

// column actions
export const addColumn = createAction('[Board] Add Column', props<{ columns: Column[] }>());
export const addNewColumnModalVisible = createAction('[Board] Add New Column Modal', props<{ addNewColumnModalVisible: boolean }>());
export const deleteColumn = createAction('[Board] Delete Column', props<{ column: Column }>());
export const editColumn = createAction('[Board] Edit Column', props<{ editColumnModalVisible: boolean, column?: Column }>());
export const updateColumnName = createAction('[Board] Update Column', props<{ currentColumn: Column, currentColumnName: string, latestColumnName: string }>());

// add new task actions
export const addNewTask = createAction('[AddNewTask] Add new task', props<{ task: Task }>());
export const updateTaskTitle = createAction('[updateTaskTitle] Update task title', props<{ task: Task, title: string }>());
export const updateTaskDescription = createAction('[updateTaskDescription] Update task description', props<{ task: Task, description: string }>());
export const updateTaskStatus = createAction('[updateTaskStatus] Update task status', props<{ task: Task, status: string }>());

// subtask actions
export const addNewSubTask = createAction('[addNewSubTask] Add new sub task', props<{ subtask: Subtask }>());
export const updateSubtaskTitle = createAction('[updateSubtaskTitle] Update Subtask Title', props<{ board: Board, column: Column, task: Task, subtask: Subtask, title: string }>());
export const updateSubtaskStatus = createAction('[updateSubtaskStatus] Update Subtask Status', props<{ board: Board, column: Column, task: Task, subtask: Subtask, isCompleted: boolean }>());