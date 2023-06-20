import * as Actions from './app.actions';
import { appReducer } from './app.reducer';
import { AppState, Column, Task } from './app.state';

describe('app.reducer.ts', () => {
    it('should add a new task to the appropriate column', () => {
        const initialState: AppState = {
            addNewTaskModalVisible: false,
            boards: [
                {
                    id: 'board1',
                    name: 'Board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'Column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1 title',
                                    description: 'Task 1 description',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const task: Task = {
            id: 'newTask',
            title: 'New Task Title',
            description: 'New Task Description',
            parentBoardId: 'board1',
            parentColumnId: 'column1'
        };

        const action = Actions.addNewTask({
            task,
            addNewTaskModalVisible: true
        });

        const updatedState = appReducer(initialState, action);

        expect(updatedState.addNewTaskModalVisible).toBe(true);

        expect(updatedState.boards[0].columns?.[0].tasks?.length).toBe(2);
        expect(updatedState.boards[0].columns?.[0].tasks?.[1].id).toBe('newTask');
        expect(updatedState.boards[0].columns?.[0].tasks?.[1].title).toBe('New Task Title');
    });
    it('should remove the specified column from the board', () => {
        const initialState: AppState = {
            boards: [
                {
                    id: 'board1',
                    name: 'Board 1',
                    columns: [
                        { id: 'column1', name: 'Column 1', parentBoardId: 'board1' },
                        { id: 'column2', name: 'Column 2', parentBoardId: 'board1' },
                        { id: 'column3', name: 'Column 3', parentBoardId: 'board1' }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const columnToDelete: Column = {
            id: 'column2',
            name: 'Column 2',
            parentBoardId: 'board1'
        };

        const action = Actions.deleteColumn({ column: columnToDelete });
        const newState = appReducer(initialState, action);

        expect(newState.boards[0].columns).toEqual([
            { id: 'column1', name: 'Column 1', parentBoardId: 'board1' },
            { id: 'column3', name: 'Column 3', parentBoardId: 'board1' }
        ]);
    });
    it('should update the column name correctly [Actions.updateColumnName]', () => {
        const initialState: AppState = {
            boards: [
                {
                    id: '1',
                    name: 'Board 1',
                    columns: [
                        {
                            id: '1',
                            name: 'Column 1',
                            parentBoardId: '1'
                        },
                        {
                            id: '2',
                            name: 'Column 2',
                            parentBoardId: '1'
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Board 2',
                    columns: [
                        {
                            id: '3',
                            name: 'Column 3',
                            parentBoardId: '2'
                        },
                        {
                            id: '4',
                            name: 'Column 4',
                            parentBoardId: '2'
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.updateColumnName({
            column: {
                id: '2',
                name: 'Column 2',
                parentBoardId: '1'
            },
            updatedName: 'New Column Name'
        })

        const expectedState: AppState = {
            boards: [
                {
                    id: '1',
                    name: 'Board 1',
                    columns: [
                        {
                            id: '1',
                            name: 'Column 1',
                            parentBoardId: '1'
                        },
                        {
                            id: '2',
                            name: 'New Column Name',
                            parentBoardId: '1'
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Board 2',
                    columns: [
                        {
                            id: '3',
                            name: 'Column 3',
                            parentBoardId: '2'
                        },
                        {
                            id: '4',
                            name: 'Column 4',
                            parentBoardId: '2'
                        }
                    ]
                }
            ] // Updated currentColumn ID
            ,

            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const newState = appReducer(initialState, action);
        expect(newState).toEqual(expectedState);
    });
    it('should add a new subtask correctly [Actions.addNewSubTask]', () => {
        // Arrange
        const initialState: AppState = {
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentBoardId: 'board1',
                                    parentColumnId: 'column1',
                                    subtasks: [
                                        {
                                            id: 'subtask1',
                                            title: 'Subtask 1',
                                            isCompleted: false,
                                            parentTaskId: 'task1',
                                            parentColumnId: 'column1',
                                            parentBoardId: 'board1'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.addNewSubTask({
            subtask: {
                id: 'subtask2',
                title: 'Subtask 2',
                isCompleted: false,
                parentTaskId: 'task1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            }
        })

        const expectedState: AppState = {
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1',
                                    subtasks: [
                                        {
                                            id: 'subtask1',
                                            title: 'Subtask 1',
                                            isCompleted: false,
                                            parentTaskId: 'task1',
                                            parentColumnId: 'column1',
                                            parentBoardId: 'board1'
                                        },
                                        {
                                            id: 'subtask2',
                                            title: 'Subtask 2',
                                            isCompleted: false,
                                            parentTaskId: 'task1',
                                            parentColumnId: 'column1',
                                            parentBoardId: 'board1'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should update the task parent column correctly [Actions.updateTaskParentColumn]', () => {
        // Arrange
        const initialState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        },
                        {
                            id: 'column2',
                            name: 'column 2',
                            parentBoardId: 'board1',
                            tasks: []
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.updateTaskParentColumn({
            newColumnId: 'column2', 
            task: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            }
        })

        const expectedState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column2',
                parentBoardId: 'board1'
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: []
                        },
                        {
                            id: 'column2',
                            name: 'column 2',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column2',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should update the subtasks status correctly [Actions.updateSubtasksStatus]', () => {
        // Arrange
        const initialState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1',
                subtasks: [
                    {
                        id: 'subtask1',
                        title: 'Subtask 1',
                        isCompleted: false,
                        parentTaskId: 'task1',
                        parentColumnId: 'column1',
                        parentBoardId: 'board1'
                    }
                ]
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1',
                                    subtasks: [
                                        {
                                            id: 'subtask1',
                                            title: 'Subtask 1',
                                            isCompleted: false,
                                            parentTaskId: 'task1',
                                            parentColumnId: 'column1',
                                            parentBoardId: 'board1'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.updateSubtasksStatus({
            task: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1',
                subtasks: [
                    {
                        id: 'subtask1',
                        title: 'Subtask 1',
                        isCompleted: true,
                        parentTaskId: 'task1',
                        parentColumnId: 'column1',
                        parentBoardId: 'board1'
                    }
                ]
            }
        })

        const expectedState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1',
                subtasks: [
                    {
                        id: 'subtask1',
                        title: 'Subtask 1',
                        isCompleted: true,
                        parentTaskId: 'task1',
                        parentColumnId: 'column1',
                        parentBoardId: 'board1'
                    }
                ]
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1',
                                    subtasks: [
                                        {
                                            id: 'subtask1',
                                            title: 'Subtask 1',
                                            isCompleted: true,
                                            parentTaskId: 'task1',
                                            parentColumnId: 'column1',
                                            parentBoardId: 'board1'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should delete the task correctly [Actions.deleteTask]', () => {
        // Arrange
        const initialState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            viewTaskModalVisible: true,
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.deleteTask({
            task: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            viewTaskModalVisible: false
        })

        const expectedState: AppState = {
            currentTask: null,
            viewTaskModalVisible: false,
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: []
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should update the task correctly [Actions.updateTask]', () => {
        // Arrange
        const initialState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Task 1',
                description: 'Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.updateTask({
            task: {
                id: 'task1',
                title: 'Updated Task 1',
                description: 'Updated Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            }
        })

        const expectedState: AppState = {
            currentTask: {
                id: 'task1',
                title: 'Updated Task 1',
                description: 'Updated Description 1',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Updated Task 1',
                                    description: 'Updated Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should update the board correctly [Actions.updateBoard]', () => {
        // Arrange
        const initialState: AppState = {
            viewTaskModalVisible: true,
            currentBoardId: 'board1',
            boards: [
                {
                    id: 'board1',
                    name: 'Board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'Column 1',
                            parentBoardId: 'board1'
                        }
                    ]
                }
            ],
            theme: '',
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.updateBoard({
            boardId: 'board1',
            latestBoardName: 'Updated Board 1',
            columns: [
                {
                    id: 'column1',
                    name: 'Updated Column 1',
                    parentBoardId: 'board1'
                },
                {
                    id: 'column2',
                    name: 'Column 2',
                    parentBoardId: 'board1'
                }
            ]
        })

        const expectedState: AppState = {
            viewTaskModalVisible: false,
            currentBoardId: 'board1',
            boards: [
                {
                    id: 'board1',
                    name: 'Updated Board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'Updated Column 1',
                            parentBoardId: 'board1'
                        },
                        {
                            id: 'column2',
                            name: 'Column 2',
                            parentBoardId: 'board1'
                        }
                    ]
                }
            ],
            theme: '',
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
    it('should set the current task correctly [Actions.setCurrentTask]', () => {
        // Arrange
        const initialState: AppState = {
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                },
                                {
                                    id: 'task2',
                                    title: 'Task 2',
                                    description: 'Description 2',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        },
                        {
                            id: 'column2',
                            name: 'column 2',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task3',
                                    title: 'Task 3',
                                    description: 'Description 3',
                                    parentColumnId: 'column2',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            currentTask: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        const action = Actions.setCurrentTask({
            task: {
                id: 'task2',
                title: 'Task 2',
                description: 'Description 2',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            }
        })

        const expectedState: AppState = {
            currentTask: {
                id: 'task2',
                title: 'Task 2',
                description: 'Description 2',
                parentColumnId: 'column1',
                parentBoardId: 'board1'
            },
            boards: [
                {
                    id: 'board1',
                    name: 'board 1',
                    columns: [
                        {
                            id: 'column1',
                            name: 'column 1',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task1',
                                    title: 'Task 1',
                                    description: 'Description 1',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                },
                                {
                                    id: 'task2',
                                    title: 'Task 2',
                                    description: 'Description 2',
                                    parentColumnId: 'column1',
                                    parentBoardId: 'board1'
                                }
                            ]
                        },
                        {
                            id: 'column2',
                            name: 'column 2',
                            parentBoardId: 'board1',
                            tasks: [
                                {
                                    id: 'task3',
                                    title: 'Task 3',
                                    description: 'Description 3',
                                    parentColumnId: 'column2',
                                    parentBoardId: 'board1'
                                }
                            ]
                        }
                    ]
                }
            ],
            theme: '',
            currentBoardId: null,
            currentColumnId: undefined,
            sidebarVisible: false,
            createBoardModalVisible: false,
            addNewTaskModalVisible: undefined,
            addNewColumnModalVisible: false,
            editColumnModalVisible: false,
            viewTaskModalVisible: false,
            editBoardModalVisible: false,
            editTaskModalVisible: false,
            user: null
        };

        // Act
        const newState = appReducer(initialState, action);

        // Assert
        expect(newState).toEqual(expectedState);
    });
});
