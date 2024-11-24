import React, { useEffect, useState } from "react";
import { useApolloClient} from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; 
import CloseIcon from "@mui/icons-material/Close"; 
import "../styles/Home.css";
import dayjs from "dayjs";
import { GET_TASKS, DELETE_TASK } from "../queries/HomeQueries";

const Home = () => {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [setError] = useState('');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.setItem('userId', "");
        navigate("/");
    }

    const handleDeleteTask = async (taskId) => {
        try {
            const { data } = await client.mutate({
                mutation: DELETE_TASK,
                variables: { id: taskId },
            });
            if (data.delete_tasks_by_pk) {
                setTasks(tasks.filter((task) => task.id !== taskId)); 
                setSelectedTask(null);
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
    }, [client, setError]);

    const handleSelectTask = (task) => {
        setSelectedTask(task);
    }

    const handleCloseModal = () => {
        setSelectedTask(null);
    }

    const getStateColor = (state) => {
      switch (state) {
        case "IN_PROGRESS":
          return "#FFEB3B"; 

        case "WAITING_FOR_CHECK":
          return "#FF9800"; 

        case "COMPLETED":
          return "#4CAF50";

        default:
          return "#2196F3";
      }
    }

    return (
      <>
        <div className={`navbar ${isNavbarOpen ? "open" : "closed"}`}>
          <IconButton className="icon-button" onClick={toggleNavbar}>
            {isNavbarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          {isNavbarOpen && (
            <div className="navbar-content">
              <Button variant="text" color="inherit" onClick={() => navigate('/form')}>
                Create Task
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
        <div className="home-container">
            <div className="task-columns">
              <div className="task-column">
                <h2>TO DO</h2>
                {tasks
                  .filter((task) => task.state === "TO_DO")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      onClick={() => handleSelectTask(task)}
                    >
                      <div
                        className="state-indicator"
                        style={{
                          backgroundColor: getStateColor(task.state),
                        }}
                      ></div>
                      <div className="task-info">
                        <h3>{task.tittle}</h3>
                        <p>{task.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="task-column">
                <h2>IN PROGRESS</h2>
                {tasks
                  .filter((task) => task.state === "IN_PROGRESS")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      onClick={() => handleSelectTask(task)}
                    >
                      <div
                        className="state-indicator"
                        style={{
                          backgroundColor: getStateColor(task.state),
                        }}
                      ></div>
                      <div className="task-info">
                        <h3>{task.tittle}</h3>
                        <p>{task.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="task-column">
                <h2>WAITING FOR CHECK</h2>
                {tasks
                  .filter((task) => task.state === "WAITING_FOR_CHECK")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      onClick={() => handleSelectTask(task)}
                    >
                      <div
                        className="state-indicator"
                        style={{
                          backgroundColor: getStateColor(task.state),
                        }}
                      ></div>
                      <div className="task-info">
                        <h3>{task.tittle}</h3>
                        <p>{task.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="task-column">
                <h2>COMPLETED</h2>
                {tasks
                  .filter((task) => task.state === "COMPLETED")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      onClick={() => handleSelectTask(task)}
                    >
                      <div
                        className="state-indicator"
                        style={{
                          backgroundColor: getStateColor(task.state),
                        }}
                      ></div>
                      <div className="task-info">
                        <h3>{task.tittle}</h3>
                        <p>{task.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
          </div>
            {selectedTask && (
              <Modal open={true} onClose={handleCloseModal}>
                <Box className="task-details-modal">
                  <Typography variant="h4">{selectedTask.tittle}</Typography>
                  <br></br>
                  <br></br>
                  <Typography variant="h6">
                    Difficulty: {selectedTask.difficulty}
                  </Typography>
                  <br></br>
                  <Typography variant="body1">State: {selectedTask.state}</Typography>
                  <br></br>
                  <Typography variant="body2">
                    Description: {selectedTask.description}
                  </Typography>
                  <br></br>
                  <Typography variant="body2">
                    Created at:{" "}
                    {dayjs(selectedTask.created_at).format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                  <br></br>
                  <Typography variant="body2">
                    Updated at:{" "}
                    {dayjs(selectedTask.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                  <br></br>
                  <Button className="modal-button" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button className="modal-button" onClick={() => handleDeleteTask(selectedTask.id)}>
                    Delete
                  </Button>
                  <Button className="modal-button" onClick={() => navigate('/form')}>
                    Update
                  </Button>
                </Box>
              </Modal>
            )}
          </div>
        </>
      );
}

export default Home;
