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
    currentTask: null,
    sidebarVisible: false,
    createBoardModalVisible: false,
    addNewColumnModalVisible: false,
    editColumnModalVisible: false,
    viewTaskModalVisible: false,
    editBoardModalVisible: false,
    editTaskModalVisible: false
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
        boards: state.boards.filter(b => b.id !== board.id)
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

    on(Actions.editBoard, (state, { editBoardModalVisible }) => ({
        ...state,
        editBoardModalVisible
    })),
    on(Actions.toggleEditTask, (state, { editTaskModalVisible }) => ({
        ...state,
        editTaskModalVisible
    })),
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
                        const updatedTasks = c.tasks?.map(t => {
                            const updatedSubtasks = t.subtasks?.map(st => ({ ...st, parentColumnName: latestColumnName }))
                            return { ...t, subtasks: updatedSubtasks, parentColumnName: latestColumnName }
                        })
                        return { ...c, name: latestColumnName, tasks: updatedTasks };
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
    on(Actions.toggleViewTask, (state, { viewTaskModalVisible, task }) => ({
        ...state,
        viewTaskModalVisible,
        currentTask: task
    })),
    on(Actions.updateTaskStatus, (state, { task, status }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === task.parentBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.name === task.parentColumnName) {
                        const updatedTasks = c.tasks?.filter(t => t.title !== task.title);
                        return { ...c, tasks: updatedTasks };
                    } else if (c.name === status) {
                        const updatedTasks = c.tasks ? [...c.tasks, { ...task, parentColumnName: status }] : [{ ...task, parentColumnName: status }];
                        return { ...c, tasks: updatedTasks };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.updateSubtasksStatus, (state, { task }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.name === task.parentBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.name === task.parentColumnName) {
                        const updatedTasks = c.tasks?.map(t => {
                            if (t.title === task.title) {
                                const updatedSubtasks = t.subtasks?.map(st => {
                                    const updatedSubtask = task.subtasks?.filter(tst => tst.title === st.title)[0];
                                    if (updatedSubtask) {
                                        return { ...st, ...updatedSubtask };
                                    } else {
                                        return st
                                    }
                                })
                                return { ...t, subtasks: updatedSubtasks };
                            }
                            return t;
                        })
                        return { ...c, tasks: updatedTasks };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.deleteTask, (state, { task }) => ({
        ...state,
        currentTask: null,
        viewTaskModalVisible: false,
        boards: state.boards.map(b => {
            if (b.name === task?.parentBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.name === task.parentColumnName) {
                        const updatedTasks = c.tasks?.filter(t => t.title !== task.title);
                        return { ...c, tasks: updatedTasks };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.updateTask, (state, { previousTask, updatedTask }) => ({
        ...state,
        currentTask: updatedTask,
        boards: state.boards.map(b => {
            if (b.name === previousTask.parentBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.name === previousTask.parentColumnName) {
                        const filteredTaskAfterRemovingPreviousTask = c.tasks?.filter(t => t.title !== previousTask.title) || [];
                        return { ...c, tasks: [...filteredTaskAfterRemovingPreviousTask, updatedTask] }
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.updateBoard, (state, { previousBoardName, latestBoardName, columns }) => ({
        ...state,
        viewTaskModalVisible: false,
        currentBoard: latestBoardName,
        boards: state.boards.map(b => {
            if (b.name === previousBoardName) {
                const updatedColumns = b.columns?.map(c => {
                    const latestData = columns?.filter(col => col.previousName === c.name)[0];
                    if (latestData) {
                        return { ...c, name: latestData.latestName, parentBoardName: latestBoardName };
                    }
                    return { ...c, parentBoardName: latestBoardName };
                })
                return { ...b, columns: updatedColumns, name: latestBoardName }
            }
            return b;
        })
    })),
    on(Actions.setCurrentTask, (state, { task }) => ({
        ...state,
        currentTask: state.boards.filter(b => b.name === task.parentBoardName)[0]
            .columns?.filter(c => c.name === task.parentColumnName)[0]
            .tasks?.filter(t => t.title === task.title)[0]
    }))
);
