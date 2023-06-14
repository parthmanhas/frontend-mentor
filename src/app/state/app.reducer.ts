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
    on(Actions.addColumn, (state, { columns }) => {
        const { parentBoardId } = columns[0];
        const boardToUpdate = state.boards.find(b => b.id === parentBoardId);
        if (!boardToUpdate) return state;

        const updatedColumns = [...(boardToUpdate.columns || []), ...columns];
        const updatedBoards = state.boards.map(b => (b.id === parentBoardId ? { ...b, columns: updatedColumns } satisfies Board : b));
        return { ...state, boards: updatedBoards } satisfies AppState;
    }),
    on(Actions.deleteColumn, (state, { column }) => {
        const { parentBoardId } = column;
        const boardToUpdate = state.boards.find(b => b.id === parentBoardId);
        if (!boardToUpdate) return state;

        const updatedColumns = boardToUpdate.columns?.filter(c => c.id !== column.id);
        const updatedBoards = state.boards.map(b => (b.id === parentBoardId ? { ...b, columns: updatedColumns } satisfies Board : b));
        return { ...state, boards: updatedBoards } satisfies AppState;
    }),
    on(Actions.addNewTask, (state, { task, addNewTaskModalVisible }) => {
        const { parentBoardId } = task;
        const { parentColumnId } = task;
        const boardToUpdate = state.boards.find(b => b.id === parentBoardId);
        if (!boardToUpdate) return state;

        const columnToUpdate = boardToUpdate.columns?.find(c => c.id === parentColumnId);
        if (!columnToUpdate) return state;

        const updatedTasks = [...(columnToUpdate.tasks || []), task];
        const updatedColumns = boardToUpdate.columns?.map(c => c.id === parentColumnId ? ({ ...c, tasks: updatedTasks } satisfies Column) : c);
        const updatedBoards = state.boards.map(b => b.id === parentBoardId ? ({ ...b, columns: updatedColumns } satisfies Board) : b);
        return { ...state, boards: updatedBoards, addNewTaskModalVisible };
    }),
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
    on(Actions.toggleViewTask, (state, { viewTaskModalVisible, task }) => ({
        ...state,
        viewTaskModalVisible,
        currentTask: task
    })),
    on(Actions.updateColumnName, (state, { column, updatedName }) => {
        const boardToUpdate = state.boards.find(b => b.id === column.parentBoardId);
        const updatedColumns = boardToUpdate?.columns?.map(c => c.id === column.id ? { ...c, name: updatedName } satisfies Column : c);
        const updatedBoards = state.boards.map(b => b.id === column.parentBoardId ? { ...b, columns: updatedColumns } satisfies Board : b);
        return { ...state, boards: updatedBoards } satisfies AppState;

    }),
    on(Actions.addNewSubTask, (state, { subtask }) => {
        const boardToUpdate = state.boards.find(b => b.id === subtask.parentBoardId);
        if (!boardToUpdate) throw new Error('boardToUpdate empty!');

        const columnToUpdate = boardToUpdate.columns?.find(c => c.id === subtask.parentColumnId);
        if (!columnToUpdate) throw new Error('columnToUpdate empty!');

        const taskToUpdate = columnToUpdate.tasks?.find(t => t.id === subtask.parentTaskId);
        if (!taskToUpdate) throw new Error('taskToUpdate empty!');

        const updatedTask = { ...taskToUpdate, subtasks: [...(taskToUpdate?.subtasks || []), subtask] } satisfies Task;
        const updatedColumn = { ...columnToUpdate, tasks: columnToUpdate.tasks?.map(t => t.id === subtask.parentTaskId ? updatedTask : t) } satisfies Column;
        const updatedBoard = { ...boardToUpdate, columns: boardToUpdate.columns?.map(c => c.id === subtask.parentColumnId ? updatedColumn : c) } satisfies Board;

        return { ...state, boards: state.boards.map(b => b.id === subtask.parentBoardId ? updatedBoard : b) } satisfies AppState;
    }),
    on(Actions.updateTaskParentColumn, (state, { task, newColumnId }) => {
        const boardToUpdate = state.boards.find(b => b.id === task.parentBoardId);
        if (!boardToUpdate) throw new Error('boardToUpdate empty!');

        const columnToRemoveTaskFrom = boardToUpdate.columns?.find(c => c.id === task.parentColumnId);
        const columnToAddTaskTo = boardToUpdate.columns?.find(c => c.id === newColumnId);
        if (!columnToRemoveTaskFrom) throw new Error('columnToRemoveTaskFrom empty!');
        if (!columnToAddTaskTo) throw new Error('columnToAddTaskTo empty!');

        const taskToUpdate = columnToRemoveTaskFrom.tasks?.find(t => t.id === task.id);
        if (!taskToUpdate) throw new Error('taskToUpdate empty!');


        const updatedTask = { ...taskToUpdate, parentColumnId: newColumnId } satisfies Task;
        const columnWithTaskRemoved = { ...columnToRemoveTaskFrom, tasks: columnToRemoveTaskFrom.tasks?.filter(t => t.id !== task.id) } satisfies Column;
        const columnWithTaskAdded = { ...columnToAddTaskTo, tasks: [...(columnToAddTaskTo.tasks || []), updatedTask] } satisfies Column;
        const updatedColumns = boardToUpdate.columns?.map(c => c.id === newColumnId ? columnWithTaskAdded : c.id === task.parentColumnId ? columnWithTaskRemoved : c);
        const updatedBoard = { ...boardToUpdate, columns: updatedColumns } satisfies Board;

        return {
            ...state,
            boards: state.boards.map(b => b.id === task.parentBoardId ? updatedBoard : b),
            currentTask: updatedTask,
        } satisfies AppState;


    }),
    on(Actions.updateSubtasksStatus, (state, { task }) => {
        const boardToUpdate = state.boards.find(b => b.id === task.parentBoardId);
        if (!boardToUpdate) throw new Error('taskToUpdate empty');

        const columnToUpdate = boardToUpdate?.columns?.find(c => c.id === task.parentColumnId);
        if (!columnToUpdate) throw new Error('taskToUpdate empty');

        const taskToUpdate = columnToUpdate?.tasks?.find(t => t.id === task.id);
        if (!taskToUpdate) throw new Error('taskToUpdate empty');

        const updatedTask = { ...taskToUpdate, subtasks: task.subtasks } satisfies Task;
        const updatedColumn = { ...columnToUpdate, tasks: columnToUpdate?.tasks?.map(t => t.id === task.id ? updatedTask : t) } satisfies Column;
        const updatedBoard = { ...boardToUpdate, columns: boardToUpdate?.columns?.map(c => c.id === task.parentColumnId ? updatedColumn : c) } satisfies Board;

        return { ...state, boards: state.boards.map(b => b.id === task.parentBoardId ? updatedBoard : b), currentTask: task } satisfies AppState;
    }),
    on(Actions.deleteTask, (state, { task, viewTaskModalVisible }) => {
        const boardToUpdate = state.boards.find(b => b.id === task.parentBoardId);
        if (!boardToUpdate) throw new Error('boardToUpdate');

        const columnToUpdate = boardToUpdate?.columns?.find(c => c.id === task.parentColumnId);
        if (!columnToUpdate) throw new Error('columnToUpdate');

        const updatedColumn = { ...columnToUpdate, tasks: columnToUpdate?.tasks?.filter(t => t.id !== task.id) } satisfies Column;
        const updatedBoard = { ...boardToUpdate, columns: boardToUpdate?.columns?.map(c => c.id === task.parentColumnId ? updatedColumn : c) } satisfies Board;
        const updatedBoards = state.boards.map(b => b.id === task.parentBoardId ? updatedBoard : b);

        return {
            ...state,
            boards: updatedBoards,
            currentTask: null,
            viewTaskModalVisible: viewTaskModalVisible ?? state.viewTaskModalVisible,
        } satisfies AppState
    }),
    on(Actions.updateTask, (state, { task }) => {
        const boardToUpdate = state.boards.find(b => b.id === task.parentBoardId);
        const columnToUpdate = boardToUpdate?.columns?.find(c => c.id === task.parentColumnId);
        const updatedColumn = { ...columnToUpdate, tasks: columnToUpdate?.tasks?.map(t => t.id === task.id ? { ...t, ...task } satisfies Task : t) } as Column;
        const updatedBoard = { ...boardToUpdate, columns: boardToUpdate?.columns?.map(c => c.id === task.parentColumnId ? updatedColumn satisfies Column : c) } as Board;
        const updatedBoards = state.boards.map(b => b.id === task.parentBoardId ? updatedBoard : b);
        return { ...state, boards: updatedBoards, currentTask: task, } satisfies AppState;
    }),
    on(Actions.updateBoard, (state, { boardId, latestBoardName, columns }) => {
        const boardToUpdate = state.boards.find(b => b.id === boardId);
        let updatedColumns = boardToUpdate?.columns?.map(c => ({ ...c, ...columns?.find(col => col.id === c.id) } satisfies Column));
        // add new columns
        const newColumns = columns?.filter(col => updatedColumns?.filter(c => c.id !== col.id).length || 0 > 0)
        updatedColumns = [...(updatedColumns || []), ...(newColumns || [])];

        const updatedBoards = state.boards.map(b => b.id === boardId ? { ...b, columns: updatedColumns, name: latestBoardName } satisfies Board : b)
        return { ...state, boards: updatedBoards, viewTaskModalVisible: false, currentBoardId: boardId, } satisfies AppState;
    }),
    on(Actions.setCurrentTask, (state, { task }) => ({
        ...state,
        currentTask: state.boards.filter(b => b.id === task.parentBoardId)[0]
            .columns?.filter(c => c.id === task.parentColumnId)[0]
            .tasks?.filter(t => t.id === task.id)[0]
    })),
    on(Actions.toggleMobile, (state, { isMobile }) => ({
        ...state,
        isMobile: isMobile ?? !state.isMobile,
    })),
    on(Actions.setMobileCss, (state, { mobileCss }) => ({
        ...state,
        mobileCss: mobileCss ?? state.mobileCss,
    }))

);
