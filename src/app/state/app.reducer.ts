// state/app.reducer.ts
import { createReducer, on } from '@ngrx/store';
// import { increment, decrement, reset } from './app.actions';
import { AppState, Board, Column, Task } from './app.state';
import * as Actions from './app.actions';

const initialState: AppState = {
    boards: [],
    theme: 'light',
    currentBoardId: null,
    currentColumnId: undefined,
    currentTask: null,
    sidebarVisible: false,
    createBoardModalVisible: false,
    addNewTaskModalVisible: false,
    addNewColumnModalVisible: false,
    editColumnModalVisible: false,
    viewTaskModalVisible: false,
    editBoardModalVisible: false,
    editTaskModalVisible: false
};

export const appReducer = createReducer(
    initialState,
    on(Actions.addBoard, (state, { board }) => ({
        ...state,
        boards: [...state.boards, board]
    })),
    on(Actions.deleteBoard, (state, { board }) => ({
        ...state,
        currentBoardId: null,
        currentColumnId: undefined,
        currentTask: null,
        boards: state.boards.filter(b => b.id !== board.id)
    })),
    on(Actions.addColumn, (state, { columns }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.id === columns[0].parentBoardId) {
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
            if (b.id === column.parentBoardId) {
                return {
                    ...b,
                    columns: b.columns?.filter(c => c.id !== column.id)
                }
            }
            return b;
        })
    })),
    on(Actions.addNewTask, (state, { task, addNewTaskModalVisible }) => ({
        ...state,
        addNewTaskModalVisible: addNewTaskModalVisible,
        boards: state.boards.map(b => {
            if (b.id === task.parentBoardId && b.columns) {
                const updatedColumns = b.columns.map(c => {
                    // task.status is the column name to which it belongs
                    if (c.id === task.parentColumnId) {
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
    on(Actions.toggleAddNewTask, (state, { addNewTaskModalVisible }) => ({
        ...state,
        addNewTaskModalVisible
    })),
    on(Actions.selectBoard, (state, { boardId }) => ({
        ...state,
        currentBoardId: state.boards.filter(b => b.id === boardId)[0].id
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
    on(Actions.updateColumnName, (state, { currentColumn, latestColumnName }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.id === currentColumn.parentBoardId) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.id === currentColumn.id) {
                        return { ...c, name: latestColumnName };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        }),
        currentColumn: currentColumn.id
    })),
    on(Actions.addNewSubTask, (state, { subtask }) => ({
        ...state,
        boards: state.boards.map(b => {
            if (b.id === subtask.parentBoardId && b.columns) {
                const updatedColumns = b.columns.map(c => {
                    if (c.id === subtask.parentColumnId && c.tasks) {
                        const updatedTasks = c.tasks.map(t => {
                            if (t.id === subtask.parentTaskId) {
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
    on(Actions.updateTaskParentColumn, (state, { task, newColumnId }) => ({
        ...state,
        currentTask: { ...state.currentTask!, parentColumnId: newColumnId },
        boards: state.boards.map(b => {
            if (b.id === task.parentBoardId) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.id === task.parentColumnId) {
                        const updatedTasks = c.tasks?.filter(t => t.id !== task.id);
                        return { ...c, tasks: updatedTasks };
                    } else if (c.id === newColumnId) {
                        const updatedTasks = c.tasks ? [...c.tasks, { ...task, parentColumnId: newColumnId }] : [{ ...task, parentColumnId: newColumnId }];
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
        currentTask: task,
        boards: state.boards.map(b => {
            if (b.id === task.parentBoardId) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.id === task.parentColumnId) {
                        const updatedTasks = c.tasks?.map(t => {
                            if (t.id === task.id) {
                                return { ...t, subtasks: task.subtasks };
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
    on(Actions.deleteTask, (state, { task, viewTaskModalVisible }) => ({
        ...state,
        currentTask: null,
        viewTaskModalVisible: viewTaskModalVisible ?? state.viewTaskModalVisible,
        boards: state.boards.map(b => {
            if (b.id === task?.parentBoardId) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.id === task.parentColumnId) {
                        const updatedTasks = c.tasks?.filter(t => t.id !== task.id);
                        return { ...c, tasks: updatedTasks };
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.updateTask, (state, { task }) => ({
        ...state,
        currentTask: task,
        boards: state.boards.map(b => {
            if (b.id === task.parentBoardId) {
                const updatedColumns = b.columns?.map(c => {
                    if (c.id === task.parentColumnId) {
                        const filteredTaskAfterRemovingPreviousTask = c.tasks?.filter(t => t.id !== task.id) || [];
                        return { ...c, tasks: [...filteredTaskAfterRemovingPreviousTask, task] }
                    }
                    return c;
                })
                return { ...b, columns: updatedColumns }
            }
            return b;
        })
    })),
    on(Actions.updateBoard, (state, { boardId, latestBoardName, columns }) => ({
        ...state,
        viewTaskModalVisible: false,
        currentBoard: boardId,
        boards: state.boards.map(b => {
            if (b.id === boardId) {
                let updatedColumns = b.columns?.map(c => {
                    let latestData!: { id: string, name: string, parentBoardId: string };
                    columns = columns?.filter(col => {
                        if (col.id === c.id) {
                            latestData = col;
                            return false;
                        }
                        return true;
                    });
                    if (latestData) {
                        return { ...c, name: latestData.name };
                    }
                    return { ...c };
                    // return { ...c, parentBoardName: latestBoardName };
                })
                if (columns) updatedColumns?.push(...columns);
                return { ...b, columns: updatedColumns, name: latestBoardName }
            }
            return b;
        })
    })),
    on(Actions.setCurrentTask, (state, { task }) => ({
        ...state,
        currentTask: state.boards.filter(b => b.id === task.parentBoardId)[0]
            .columns?.filter(c => c.id === task.parentColumnId)[0]
            .tasks?.filter(t => t.id === task.id)[0]
    }))
);
