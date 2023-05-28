export interface AppState {
    boards: Board[],
    theme: string,
    currentBoardId: string | null,
    currentColumnId: string | undefined,
    currentTask: Task | null | undefined,
    sidebarVisible: boolean,
    createBoardModalVisible: boolean,
    addNewTaskModalVisible: boolean | undefined,
    addNewColumnModalVisible: boolean,
    editColumnModalVisible: boolean,
    viewTaskModalVisible: boolean,
    editBoardModalVisible: boolean,
    editTaskModalVisible: boolean
}

export interface Board {
    id: string,
    name: string,
    options?: Option[],
    columns?: Column[]
}

export interface Option {
    name: string
}

export interface Column {
    id: string,
    name: string,
    parentBoardId: string
    tasks?: Task[],
}

export interface Task {
    id: string,
    title: string,
    description: string,
    subtasks?: Subtask[],
    parentColumnId: string
    parentBoardId: string
}

export interface Subtask {
    id: string,
    title: string,
    isCompleted: boolean
    parentTaskId: string,
    parentColumnId: string,
    parentBoardId: string
}