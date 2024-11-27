import React, { useState, useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, Typography, IconButton, TextField, Container, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import '../styles/Form.css'
import { CREATE_TASK_MUTATION, UPDATE_TASK, GET_TASK_BY_ID } from '../queries/FormQuery';

const Form = () => {
    const [tittle, setTittle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [state, setState] = useState('TO_DO');
    const [isCreateTask, setIsCreateTask] = useState(true);
    const [error, setError] = useState('');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const client = useApolloClient();
    const navigate = useNavigate();

    const taskId = localStorage.getItem('taskId');
    
    const { data } = useQuery(GET_TASK_BY_ID, {
        variables: { id: taskId },
        skip: !taskId, 
    });

    useEffect(() => {
        if (taskId && data && data.tasks_by_pk) {
            setIsCreateTask(false);
            setTittle(data.tasks_by_pk.tittle);
            setDescription(data.tasks_by_pk.description);
            setState(data.tasks_by_pk.state);
            setDifficulty(data.tasks_by_pk.difficulty);
            setImageUrl(data.tasks_by_pk.image_url || '');
        }
    }, [taskId, data]);

    const handleLogout = async () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('taskId');
        navigate("/");
    };

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleClickHome = () => {
        navigate('/home');
        localStorage.removeItem('taskId');
        window.location.reload();
    }

    const handleCreateTask = async () => {
        if (state == null || state === '') setState('TO_DO');
        if (!tittle || !description) {
            setError('Please fill out all fields');
            return;
        }
        setIsCreateTask(true);
        try {
            const userId = localStorage.getItem("userId");
            const currentTimeStamp = dayjs().toISOString();
            const { data } = await client.mutate({
                mutation: CREATE_TASK_MUTATION,
                variables: {
                    tittle,
                    description,
                    state,
                    difficulty,
                    userId: userId,
                    createdAt: currentTimeStamp,
                    updatedAt: currentTimeStamp,
                    imageUrl,
                },
            });
            if (data.insert_tasks_one) {
                alert('Task created successfully');
                handleClickHome();
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            console.error('Create task error: ', error);
            setError(error.message);
        }
    };

    const handleUpdateTask = async () => {
        if (!taskId) {
            setError("Task ID not found");
            return;
        }
        if (!tittle || !description) {
            setError('Please fill out all fields');
            return;
        }
        setIsCreateTask(false);
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_TASK,
                variables: {
                    id: localStorage.getItem('taskId'),
                    state,
                    description,
                    updatedAt: dayjs().toISOString(),
                    imageUrl,
                },
            });
            if (data.update_tasks_by_pk) {
                alert('Task updated successfully');
                handleClickHome();
            }
        } catch (error) {
            console.error("Update task error:", error);
            setError(error.message);
        }
    };

    return (
        <>
            <div className={`navbar ${isNavbarOpen ? "open" : "closed"}`}>
                <IconButton className="icon-button" onClick={toggleNavbar}>
                    {isNavbarOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                {isNavbarOpen && (
                    <div className="navbar-content">
                        <Button variant="text" color="inherit" onClick={handleClickHome}>Task's list</Button>
                        <Button className="button-logout" variant="text" color="inherit" onClick={handleLogout}>LogOut</Button>
                    </div>
                )}
            </div>
            <Container maxWidth="xs" className="form-container">
                <Typography variant="h4" gutterBottom>{isCreateTask ? "Create" : "Update"}</Typography>
                <TextField label="Tittle" variant="outlined" fullWidth margin="normal" value={tittle} disabled={!isCreateTask} onChange={(e) => setTittle(e.target.value)} />
                <TextField label="Description" variant="outlined" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="state-label">State</InputLabel>
                    <Select labelId="state-label" value={state} onChange={(e) => setState(e.target.value)} label="State" >
                        <MenuItem value="TO_DO">TO DO</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                        <MenuItem value="WAITING_FOR_CHECK">WAITING FOR CHECK</MenuItem>
                        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Difficulty" variant="outlined" type="number" fullWidth margin="normal" disabled={!isCreateTask} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
                <TextField label="Image" variant="outlined" fullWidth margin="normal" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" className='button-create-update' color="inherit" fullWidth onClick={isCreateTask ? handleCreateTask : handleUpdateTask}>
                    {isCreateTask ? "Create" : "Update"}
                </Button>
            </Container>
        </>
    );
};

export default Form;