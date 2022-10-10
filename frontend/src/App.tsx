import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import NewTask from "./components/NewTask";
import TaskList from "./components/TaskList";
import { TaskType } from "./components/taskTypes";

const client = axios.create({
  baseURL: "/api",
});

const App = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState<AxiosError>();

  // For the first page hit, fetch every task from backend DB.
  useEffect(() => {
    client
      .get("/tasks")
      .then((response) => {
        setTasks(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  // Handler for Add Task button.
  const addTaskHandler = (task: TaskType) => {
    // send POST request and append the response data to array `tasks`.
    // The response comes with an ID generated by the backend DB.
    client
      .post("/tasks", task)
      .then((response) => {
        if (response.data.error !== undefined && response.data.error !== "") {
          alert(`Error from server: ${response.data.error}`);
          return;
        }
        setTasks((prevTasks: TaskType[]) => {
          return [...prevTasks, response.data];
        });
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Handler for Edit button.
  const editTaskHandler = (task: TaskType) => {
    // send PUT request and update the task upon receiving a response
    console.log("trying to edit: ");
    console.log(task);
    client
      .put(`/tasks/${task._id}`, task)
      .then((response) => {
        console.log(response);
        setTasks((prevTasks: TaskType[]) => {
          return prevTasks.map((elem: TaskType) => {
            if (elem._id !== task._id) return elem;
            else return task;
          });
        });
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Handler for Delete button.
  const deleteTaskHandler = (task: TaskType) => {
    // send DELETE request and delete the task up on reception from backend DB
    console.log("trying to delete: ");
    console.log(task);
    client
      .delete(`/tasks/${task._id}`)
      .then(() => {
        setTasks((prevTasks: TaskType[]) => {
          return prevTasks.filter((elem: TaskType) => elem._id !== task._id);
        });
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (error) {
    return <h2>{`Error: ${error.message}`}</h2>;
  }

  return (
    <div>
      <NewTask onAddTask={addTaskHandler} />
      <TaskList
        tasks={tasks}
        onDeleteTask={deleteTaskHandler}
        onEditTask={editTaskHandler}
      />
    </div>
  );
};

export default App;