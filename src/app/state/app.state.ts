export interface AppState {
    boards: Board[],
    theme: string,
    currentBoard: string | null,
    currentColumn: string | undefined,
    currentTask: Task | null | undefined,
    sidebarVisible: boolean,
    createBoardModalVisible: boolean,
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
    tasks?: Task[],
    parentBoardName: string
}

export interface Task {
    id: string,
    title: string,
    description: string,
    status: string,
    subtasks?: Subtask[],
    parentColumnName: string
    parentBoardName: string
}

export interface Subtask {
    id: string,
    title: string,
    isCompleted: boolean
    parentTaskTitle: string,
    parentColumnName: string,
    parentBoardName: string
}