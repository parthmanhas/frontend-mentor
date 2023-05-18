export interface AppState {
    boards: Column[],
    theme: string
}

export interface Board {
    name: string,
    columns?: Column[]
}

export interface Column {
    name: string,
    tasks?: Task[]
}

export interface Task {
    title: string,
    description: string,
    status: string,
    subtasks?: Subtask[]
}

export interface Subtask {
    title: string,
    isCompleted: boolean
}