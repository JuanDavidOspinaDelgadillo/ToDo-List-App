import React, { useEffect, useState } from "react";
import { useApolloClient} from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; 
import CloseIcon from "@mui/icons-material/Close"; 
import dayjs from "dayjs";
import { CREATE_TASK_MUTATION, UPDATE_TASK } from '../queries/FormQuery'

const Form = () => {

    const [tittle, setTittle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [state, setState] = useState('');
    const [tasks, setTasks] = useState([]);
    const [setError] = useState('');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.setItem('userId', "");
        navigate("/");
    }

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleCreateTask = async () => {
        if(!tittle || !description) {
            setError('Please fill out all fields');
            return;
        }
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
                    user_id: userId,
                    createdAt: currentTimeStamp,
                    updatedAt: currentTimeStamp,
                },
            });
            if(data.insert_tasks_one) {
                setTasks([...tasks, data.insert_tasks_one]);
                alert('Task created successfully');
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            console.error('Create task error: ', error);
            setError(error.message);
        }
    }

    const handleUpdateTask = async (taskId, newState, newDescription) => {
        try {
            const currentTimeStamp = dayjs().toISOString();
            const { data } = await client.mutate({
                mutation: UPDATE_TASK,
                variables: {
                    id: taskId,
                    state: newState,
                    description: newDescription,
                    updatedAt: currentTimeStamp,
                },
            });
            if (data.update_tasks_by_pk) {
                const updatedTasks = tasks.map((task) => 
                    task.id === taskId ? {...task, state: newState, description: newDescription, updated_at: currentTimeStamp } : task
                );
                setTasks(updatedTasks);
                alert('Task updated successfully');
            }
        } catch (error) {
            console.error("Update task error:", error);
            setError(error.message);
        }
    }

    return (
        <div className={`navbar ${isNavbarOpen ? "open" : "closed"}`}>
          <IconButton className="icon-button" onClick={toggleNavbar}>
            {isNavbarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          {isNavbarOpen && (
            <div className="navbar-content">
              <Button variant="text" color="inherit" onClick={() => navigate('/home')}>
                Task's list
              </Button>
              <Button variant="text" color="inherit" onClick={() => navigate('/galery')}>
                Gallery
              </Button>
              <Button
                className="button-logout"
                variant="text"
                color="inherit"
                onClick={handleLogout}
              >
                LogOut
              </Button>
            </div>
          )}
        </div>
    )
}
export default Form;