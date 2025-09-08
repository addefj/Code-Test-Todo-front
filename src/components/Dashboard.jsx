import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import { getTodos } from "../services/taskService.js";
import { getPersons } from "../services/personService.js";
import { getPersonName } from "../utils/personUtils.js";

const Dashboard = () => {
  const token = localStorage.getItem("auth_token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [persons, setPersons] = useState([]);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetchAllTasks();
    fetchAllPersons();
  }, []);

  const fetchAllTasks = async () => {
    try {
      console.log("Started Fetching tasks");
      const response = await getTodos(token);
      if (response.status === 200) {
        console.log("Task Response: ", response);
        setTodos(response.data);
      }
      console.log("Finished Fetching tasks");
    } catch (error) {
      console.error("There was an error fetching the tasks!", error);
    }
  };

  const fetchAllPersons = async () => {
    try {
      console.log("Started fetching persons");
      const response = await getPersons(token);
      if (response.status === 200) {
        console.log("Person Response: ", response);
        setPersons(response.data);
      }
      console.log("Finished fetching persons");
    } catch (error) {
      console.error("There was an error fetching the persons!", error);
    }
  };

const today = new Date();
const pendingCount = todos.filter(t => !t.completed && !t.personId).length;
const inProgressCount = todos.filter(t => !t.completed && t.personId).length;
const completedCount = todos.filter(t => t.completed).length;
const overdueCount = todos.filter(t => !t.completed && new Date(t.dueDate) < today).length;
const recentTasks = todos.filter(t => new Date(t.dueDate) >= today);
const overdueTasks = todos.filter(t => new Date(t.dueDate) < today && !t.completed);

  const TaskTable = ({ title, isOverdue }) => (
    <div className="tasks-section">
      <div className="section-header">
        <h2>
          <span className={isOverdue ? "text-danger" : ""}>{title}</span>
          {isOverdue && (
            <span className="badge bg-danger ms-2">{overdueCount}</span>
          )}
        </h2>
        <button className="btn btn-link text-decoration-none">
          View All
          <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: "40px" }}>
                #
              </th>
              <th scope="col">Task</th>
              <th scope="col">Assignee</th>
              <th scope="col">Due Date</th>
              <th scope="col" style={{ width: "120px" }}>
                Status
              </th>
              <th scope="col" style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={todo.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="fw-medium">{todo.title}</div>
                </td>
                <td>{todo.personId ? getPersonName(todo.personId, persons) : "Unassigned"}</td>
                <td>
                  <div className={isOverdue ? "text-danger" : ""}>
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      !todo.completed
                        ? todo.personId
                          ? "bg-primary"
                          : "bg-warning text-dark"
                        : "bg-success"
                    } `}
                  >
                    {!todo.completed
                      ? todo.personId
                        ? "in-progress"
                        : "pending"
                      : "completed"}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-link btn-sm p-0"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item">Edit</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Mark Complete</button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger">
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="dashboard-main">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your tasks overview"
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-info">
                <h3>Pending</h3>
                <p className="stat-number">{pendingCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon in-progress">
                <i className="bi bi-arrow-clockwise"></i>
              </div>
              <div className="stat-info">
                <h3>In Progress</h3>
                <p className="stat-number">{inProgressCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">
                <i className="bi bi-check2-circle"></i>
              </div>
              <div className="stat-info">
                <h3>Completed</h3>
                <p className="stat-number">{completedCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon overdue">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-info">
                <h3>Overdue</h3>
                <p className="stat-number">{overdueCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-info">
                <h3>Users</h3>
                <p className="stat-number">{persons.length}</p>
              </div>
            </div>
          </div>

          <div className="tasks-grid">
            <TaskTable
              tasks={recentTasks}
              title="Recent Tasks"
              isOverdue={false}
            />
            <TaskTable
              tasks={overdueTasks}
              title="Overdue Tasks"
              isOverdue={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
