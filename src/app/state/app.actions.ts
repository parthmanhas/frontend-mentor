import { createAction, props } from '@ngrx/store';
import { Board, Column, DatabaseAppState, MobileCss, Subtask, Task } from './app.state';

// application actions
export const changeTheme = createAction('[Sidebar] Change Theme', props<{ theme: string }>());
export const addAppState = createAction('[App] Add App State', props<{ appState: DatabaseAppState, isMobile: boolean }>());
export const setUser = createAction('[App] Set User', props<{ user: { id: string, email: string } }>());

// board actions
export const addBoard = createAction('[Board] Add Board', props<{ board: Board }>());
export const deleteBoard = createAction('[Board] Delete Board', props<{ board: Board }>());
export const editBoard = createAction('[Board] Edit Board', props<{ editBoardModalVisible: boolean }>());
export const selectBoard = createAction('[Board] Select Board', props<{ boardId: string }>());
export const createBoardModalVisible = createAction('[Board] Display create board modal', props<{ createBoardModalVisible: boolean }>());
export const updateBoard = createAction('[Board] Update Board', props<{ boardId: string, latestBoardName: string, columns?: { id: string, name: string, parentBoardId: string }[] }>());

// sidebar actions
export const toggleSidebar = createAction('[Sidebar] Toggle Sidebar', props<{ sidebarVisible: boolean }>());

// column actions
export const addColumn = createAction('[Board] Add Column', props<{ columns: Column[] }>());
export const addNewColumnModalVisible = createAction('[Board] Add New Column Modal', props<{ addNewColumnModalVisible: boolean }>());
export const deleteColumn = createAction('[Board] Delete Column', props<{ column: Column }>());
export const updateColumnName = createAction('[Board] Update Column Name', props<{ column: Column, updatedName: string }>());
export const updateColumnTasks = createAction('[Board] update Column Tasks', props<{ column: Column }>());

// task actions
export const addNewTask = createAction('[AddNewTask] Add new task', props<{ task: Task, addNewTaskModalVisible?: boolean }>());
export const updateTaskTitle = createAction('[updateTaskTitle] Update task title', props<{ task: Task, title: string }>());
export const updateTaskDescription = createAction('[updateTaskDescription] Update task description', props<{ task: Task, description: string }>());
export const updateTaskParentColumn = createAction('[updateTaskParentColumn] Update task parent column', props<{ task: Task, newColumnId: string }>());
export const updateTask = createAction('[updateTask] Update task', props<{ task: Task }>());
export const toggleViewTask = createAction('[toggleViewTask] Toggle view status', props<{ viewTaskModalVisible: boolean, task: Task | null }>());
export const toggleEditTask = createAction('[toggleEditTask] Toggle edit task', props<{ editTaskModalVisible: boolean }>());
export const toggleAddNewTask = createAction('[toggleAddNewTask] Toggle add new task', props<{ addNewTaskModalVisible: boolean }>());
export const deleteTask = createAction('[deleteTask] Delete Task', props<{ task: Task, viewTaskModalVisible?: boolean }>());
export const setCurrentTask = createAction('[setCurrentTask] Set Current task', props<{ task: Task }>());

// subtask actions
export const addNewSubTask = createAction('[addNewSubTask] Add new sub task', props<{ subtask: Subtask }>());
export const updateSubtaskTitle = createAction('[updateSubtaskTitle] Update Subtask Title', props<{ board: Board, column: Column, task: Task, subtask: Subtask, title: string }>());
export const updateSubtasksStatus = createAction('[updateSubtasksStatus] Update Subtask status', props<{ task: Task }>());
// export const updateSubtaskStatus = createAction('[updateSubtaskStatus] Update Subtask Status', props<{ board: Board, column: Column, task: Task, subtask: Subtask, isCompleted: boolean }>());

// mobile
export const toggleMobile = createAction('[toggleMobile] toggle mobile', props<{ isMobile: boolean }>());
export const setMobileCss = createAction('[setMobileCss] set css required for mobile', props<{ mobileCss: MobileCss }>());