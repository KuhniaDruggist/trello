import React, { useState } from 'react';
import { v1 } from 'uuid';
import { Todolist } from './components/Todolist/Todolist';
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { FilterValuesType } from './components/Todolist/types';
import { TaskType } from './components/Todolist/Task/types';

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App () {
    const todoListIdFirst = v1();
    const todoListIdSecond = v1();

    const [ todoLists, setTodoLists ] = useState<TodolistType[]>([
        { id: todoListIdFirst, title: 'What to learn', filter: 'active' },
        { id: todoListIdSecond, title: 'What to read', filter: 'completed' },
    ]);
    const [ tasks, setTasks ] = useState<TasksStateType>({
        [todoListIdFirst]: [
            { id: v1(), title: 'HTML&CSS', isDone: false },
            { id: v1(), title: 'JS', isDone: false },
            { id: v1(), title: 'React', isDone: true },
            { id: v1(), title: 'Rest API', isDone: true },
            { id: v1(), title: 'GraphQL ', isDone: true },
        ],
        [todoListIdSecond]: [
            { id: v1(), title: 'Война и мир', isDone: false },
            { id: v1(), title: 'Три товарища', isDone: true },
            { id: v1(), title: 'На западном фронте без перемен', isDone: true },
        ],
    });

    function addNewTodoList (title: string) {
        const newTodoListId = v1();
        const newTodoList: TodolistType = { id: newTodoListId, title, filter: 'all' };
        setTodoLists([ newTodoList, ...todoLists ]);
        setTasks({ ...tasks, [newTodoListId]: [] });
    }

    function removeTodoList (todoListId: string) {
        setTodoLists(todoLists.filter(t => t.id !== todoListId));
        delete tasks[todoListId];
    }

    function changeTodoTitle (title: string, todoListId: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListId
            ? { ...tl, title }
            : tl));
    }

    function changeFilter (filter: FilterValuesType, todoListId: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListId
            ? { ...tl, filter }
            : tl));
    }

    function addTask (newTitle: string, todoListId: string) {
        const newTask = { id: v1(), title: newTitle, isDone: false };
        const taskList = tasks[todoListId];
        tasks[todoListId] = [ newTask, ...taskList ];
        setTasks({ ...tasks });
    }

    function removeTask (id: string, todoListId: string) {
        const tasksList = tasks[todoListId];
        tasks[todoListId] = tasksList.filter(task => task.id !== id);
        setTasks({ ...tasks });
    }

    function changeTaskTitle (taskId: string, title: string, todoListId: string) {
        const taskList = tasks[todoListId];
        tasks[todoListId] = taskList.map(t => t.id === taskId ? { ...t, title } : t);
        setTasks({ ...tasks });
    }

    function changeStatus (taskId: string, isDone: boolean, todoListId: string) {
        const taskList = tasks[todoListId];
        tasks[todoListId] = taskList.map(t => t.id === taskId ? { ...t, isDone } : t);
        setTasks({ ...tasks });
    }

    function getTasksForRendering (todoList: TodolistType): TaskType[] {
        switch (todoList.filter) {
            case 'active':
                return tasks[ todoList.id ].filter(t => !t.isDone);
            case 'completed':
                return tasks[ todoList.id ].filter(t => t.isDone);
            default:
                return tasks[ todoList.id ];
        }
    }

    const todoListsForRendering = todoLists.map(tl => {
        return (
            <Grid
                item
                key={ tl.id }
            >
                <Paper
                    style={ { padding: '15px', width: '290px' } }
                    elevation={ 5 }
                >
                    <Todolist
                        todoListId={ tl.id }
                        title={ tl.title }
                        filter={ tl.filter }
                        tasks={ getTasksForRendering(tl) }
                        changeTodoTitle={ changeTodoTitle }
                        removeTodoList={ removeTodoList }
                        changeFilter={ changeFilter }
                        addTask={ addTask }
                        removeTask={ removeTask }
                        changeTaskTitle={ changeTaskTitle }
                        changeTaskStatus={ changeStatus }
                    />
                </Paper>
            </Grid>
        );
    });

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={ { justifyContent: 'space-between' } }>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Trello
                    </Typography>
                    <Button
                        variant="outlined"
                        color="inherit"
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid
                    style={ { marginTop: '30px', marginBottom: '35px' } }
                >
                    <AddItemForm
                        placeholder="Add new todo"
                        addItem={ addNewTodoList }
                    />
                </Grid>
                <Grid
                    container
                    spacing={ 5 }
                >
                    { todoListsForRendering }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
