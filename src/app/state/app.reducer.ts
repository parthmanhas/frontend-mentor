// state/app.reducer.ts
import { createReducer, on } from '@ngrx/store';
// import { increment, decrement, reset } from './app.actions';
import { AppState, Board, Column, Task } from './app.state';
import * as Actions from './app.actions';

const initialState: AppState = {
    boards: [],
    theme: 'light',
    currentBoard: null,
    currentColumn: undefined,
    sidebarVisible: false,
    createBoardModalVisible: false,
    addNewColumnModalVisible: false,
    editColumnModalVisible: false
};

// export const appReducer = createReducer(
//   initialState,
//   on(increment, state => ({ ...state, counter: state.counter + 1 })),
//   on(decrement, state => ({ ...state, counter: state.counter - 1 })),
//   on(reset, state => ({ ...state, counter: 0 }))
// );

export const appReducer = createReducer(
    initialState,
    on(Actions.addBoard, (state, { board }) => ({
        ...state,
        boards: [...state.boards, board]
    })),
    on(Actions.deleteBoard, (state, { board }) => ({
        ...state,
        boards: state.boards.filter(b => b.name !== board.name)
    })),
    on(Actions.addColumn, (state, { columns }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === columns[0].parentBoardName) {
                return {
                    ...b,
                    columns: [...b.columns || [], ...columns]
                }
            }
            return b;
        })
    })),
    on(Actions.deleteColumn, (state, { column }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === column.parentBoardName) {
                return {
                    ...b,
                    columns: b.columns?.filter(c => c.name !== column.name)
                }
            }
            return b;
        })
    })),
    on(Actions.addNewTask, (state, { task }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === task.parentBoardName && b.columns) {
                const updatedColumns = b.columns.map(c => {
                    // task.status is the column to which it belongs
                    if (c.name === task.status) {
                        const updatedTasks = c.tasks ? [...c.tasks, task] : [task]
                        return { ...c, tasks: updatedTasks } as Column;
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns } as Board;
            }
            return b;
        })
    })),
    
    on(Actions.editBoard, (state, { board }) => {
        console.log('Not implemented yet!')
        return state;
    }),
    on(Actions.selectBoard, (state, { boardName }) => ({
        ...state,
        currentBoard: state.boards.filter(b => b.name === boardName)[0].name
    })),
    on(Actions.changeTheme, (state, { theme }) => ({
        ...state,
        theme
    })),
    on(Actions.toggleSidebar, (state, { sidebarVisible }) => ({
        ...state,
        sidebarVisible
    })),
    on(Actions.createBoardModalVisible, (state, { createBoardModalVisible }) => ({
        ...state,
        createBoardModalVisible
    })),
    on(Actions.addNewColumnModalVisible, (state, { addNewColumnModalVisible }) => ({
        ...state,
        addNewColumnModalVisible
    })),
    on(Actions.editColumn, (state, { editColumnModalVisible, column }) => ({
        ...state,
        editColumnModalVisible,
        currentColumn: column?.name
    })),
    on(Actions.updateColumnName, (state, { currentColumn, currentColumnName, latestColumnName }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === currentColumn.parentBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.name === currentColumnName) {
                        const t = { ...c, name: latestColumnName };
                        return t
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        }),
        currentColumn: latestColumnName
    })),
    on(Actions.addNewSubTask, (state, { subtask }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === subtask.parentBoardName && b.columns) {
                const updatedColumns = b.columns.map(c => {
                    if (c.name === subtask.parentColumnName && c.tasks) {
                        const updatedTasks = c.tasks.map(t => {
                            if (t.title === subtask.parentTaskTitle) {
                                const updatedSubtasks = t.subtasks ? [...t.subtasks, subtask] : [subtask]
                                return { ...t, subtasks: updatedSubtasks };
                            }
                            return t;
                        })
                        return { ...c, tasks: updatedTasks };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns };
            }
            return b;
        })
    })),
);
