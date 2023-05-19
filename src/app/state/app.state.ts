export interface AppState {
    boards: Board[],
    theme: string,
    currentBoard: string | null,
    currentColumn: string | undefined,
    sidebarVisible: boolean,
    createBoardModalVisible: boolean,
    addNewColumnModalVisible: boolean,
    editColumnModalVisible: boolean
}

export interface Board {
    name: string,
    options?: Option[],
    columns?: Column[]
}

export interface Option {
    name: string
}

export interface Column {
    name: string,
    tasks?: Task[],
    parentBoardName: string
}

export interface Task {
    title: string,
    description: string,
    status: string,
    subtasks?: Subtask[],
    parentColumnName: string
    parentBoardName: string
}

export interface Subtask {
    title: string,
    isCompleted: boolean
    parentTaskTitle: string,
    parentColumnName: string,
    parentBoardName: string
}