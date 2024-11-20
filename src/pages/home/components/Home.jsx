import React, { useEffect, useState } from "react";
import { useApolloClient} from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; 
import CloseIcon from "@mui/icons-material/Close"; 
import "../styles/Home.css";
import dayjs from "dayjs";
import { 
        GET_TASKS, 
        GET_TASKS_BY_DIFFICULTY, 
        GET_TASKS_BY_STATE, 
        CREATE_TASK_MUTATION, 
        UPDATE_TASK, 
        DELETE_TASK 
    } from "../queries/HomeQueries";

const Home = () => {
    const [tittle, setTittle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [state, setState] = useState('');
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [error, setError] = useState('');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.setItem('userId', "");
        navigate("/");
    }

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

    const handleDeleteTask = async (taskId) => {
        try {
            const { data } = await client.mutate({
                mutation: DELETE_TASK,
                variables: { id: taskId },
            });
            if (data.delete_tasks_by_pk) {
                setTasks(tasks.filter((task) => task.id !== taskId)); 
                alert("Task deleted successfully!");
            }
        } catch (error) {
            console.error("Delete task error:", error);
            setError(error.message);
        }
    };

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = parseInt(parseInt(localStorage.getItem('userId')));
                const { data } = await client.query({
                    query: GET_TASKS,
                    variables: { userId }
                });
                setTasks(data.tasks);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
                setError(error.message);
            }
        };
        fetchTasks();
    }, [client]);

    const handleSelectTask = (task) => {
        setSelectedTask(task);
    }

    const handleCloseModal = () => {
        setSelectedTask(null);
    }

    return (
      <><div className={`navbar ${isNavbarOpen ? "open" : "closed"}`}>
        <IconButton className="icon-button" onClick={toggleNavbar}>
          {isNavbarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        {isNavbarOpen && (
          <div className="navbar-content">
            <Button variant="text" color="inherit">
              Create Task
            </Button>
            <Button variant="text" color="inherit">
              Filter
            </Button>
            <Button variant="text" color="inherit">
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
      </div><div className="home-container">
          <div className="task-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
                onClick={() => handleSelectTask(task)}
              >
                <h3>{task.tittle}</h3>
                <p>
                  {task.state} | Difficulty: {task.difficulty}
                </p>
              </div>
            ))}
          </div>
          {selectedTask && (
            <Modal open={true} onClose={handleCloseModal}>
              <Box className="task-details-modal">
                <Typography variant="h4">{selectedTask.tittle}</Typography>
                <Typography variant="h6">
                  Difficulty: {selectedTask.difficulty}
                </Typography>
                <Typography variant="body1">State: {selectedTask.state}</Typography>
                <Typography variant="body2">
                  Description: {selectedTask.description}
                </Typography>
                <Typography variant="body2">
                  Created at:{" "}
                  {dayjs(selectedTask.created_at).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Typography variant="body2">
                  Updated at:{" "}
                  {dayjs(selectedTask.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Button className="modal-button" onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </Modal>
          )}
        </div></>
    );      
}

export default Home;
