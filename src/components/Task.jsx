import React, { useEffect, useState } from "react";
import "./Task.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import axios from "axios";
import { useForm } from "react-hook-form";
import { sortTodos, filterTodos } from "../services/taskService.js";

const Task = () => {
  // todo*: make this component functional by implementing state management and API calls
  const apiEndpointTodo = "http://localhost:9090/api/todo";
  const apiEndpointPerson = "http://localhost:9090/api/person";
  const token = localStorage.getItem("auth_token");
  const [todos, setTodos] = useState([]);
  const [persons, setPersons] = useState([]);
  const [sortType, setSortType] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchAllTasks();
    fetchAllPersons();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      personId: "",
      numberOfAttachments: 0,
    },
  });

  const emptyFormValues = {
    title: "",
      description: "",
      dueDate: "",
      personId: "",
      numberOfAttachments: 0,
  };

  const OnEdit = (todo) => {
    reset(todo);
    setEditingTodo(todo); // mark this todo as being edited
  };

  const [selectedFiles, setSelectedFiles] = useState([]); // State to hold selected attachments

  const handleFileSelection = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(newFiles);
  };

  const OnDelete = async (id) => {
    console.log("Delete task with id: ", id);
    try {
      const response = await axios.delete(apiEndpointTodo + "/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        console.log("Task successfully deleted");
        fetchAllTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error("There was an error deleting the task!", error);
    }
  };

  const onMarkComplete = async (data) => {
    console.log("Mark task as complete with id: ", data.id);

    data.completed = !data.completed;

    try {
      const response = await axios.put(apiEndpointTodo + "/" + data.id, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        console.log("Task successfully updated:", response.data);
        fetchAllTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error("There was an error updating the task!", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingTodo) {
        // ✏️ Editing existing todo
        const response = await axios.put(
          apiEndpointTodo + "/" + editingTodo.id,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 204) {
          console.log("Task successfully updated:", response.data);
        }
        setEditingTodo(null);
        reset(emptyFormValues);
      } else {
        // ➕ Creating new todo
        const response = await axios.post(apiEndpointTodo, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 201) {
          console.log("Task successfully created:", response.data);
        }
      }
      reset(); // Reset the form after successful submission
      setSelectedFiles([]); // Clear selected files
      fetchAllTasks(); // Refresh the task list
    } catch (error) {
      console.error("There was an error creating the task!", error);
    }
  };

  const fetchAllTasks = async () => {
    console.log("Started Fetching tasks");

    await axios
      .get(apiEndpointTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Task Response: ", response);
        if (response.status === 200) {
          setTodos(response.data);
        } else {
          console.log("Unexpected response status: ", response.status);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks!", error);
      });
    console.log("Finished Fetching tasks");
  };

  const fetchAllPersons = async () => {
    console.log("Started fetching persons");

    await axios
      .get(apiEndpointPerson, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Person Response: ", response);
        if (response.status === 200) {
          setPersons(response.data);
        } else {
          console.log("Unexpected response status: ", response.status);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the persons!", error);
      });
    console.log("Finished fetching persons");
  };

  const getPersonName = (id) => {
    const person = persons.find((p) => p.id === id);
    return person ? person.name : "";
  };

  const onSort = (type) => {
    setSortType(type);
  };

  const onFilter = (type) => {
    setFilterType(type);
  };

  const getVisibleTodos = () => {
    let visible = [...todos];

    // Apply filter first
    if (filterType) {
      visible = filterTodos(filterType, visible);
    }

    // Then apply sort
    if (sortType) {
      visible = sortTodos(sortType, visible);
    }

    return visible;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />
      <main className="dashboard-main">
        <Header
          title="Tasks"
          subtitle="Manage and organize your tasks"
          onToggleSidebar={() => {}}
        />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm task-form-section">
                <div className="card-body">
                  <h2 className="card-title mb-4">Add New Task</h2>
                  <form id="todoForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="todoTitle" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        id="todoTitle"
                        {...register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 3,
                            message: "Title must be at least 3 characters",
                          },
                        })}
                      />
                      {errors.title && (
                        <div className="invalid-feedback">
                          {errors.title.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="todoDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        id="todoDescription"
                        rows="3"
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 3,
                            message:
                              "Description must be at least 3 characters",
                          },
                        })}
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description.message}
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="todoDueDate" className="form-label">
                          Due Date
                        </label>
                        <input
                          type="datetime-local"
                          className={`form-control ${
                            errors.dueDate ? "is-invalid" : ""
                          }`}
                          id="todoDueDate"
                          {...register("dueDate", {
                            required: "Due date is required",
                          })}
                        />
                        {errors.dueDate && (
                          <div className="invalid-feedback">
                            {errors.dueDate.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="todoPerson" className="form-label">
                          Assign to Person
                        </label>
                        <select
                          className="form-select"
                          id="todoPerson"
                          {...register("personId")}
                        >
                          <option value="">
                            -- Select Person (Optional) --
                          </option>

                          {persons.length > 0 &&
                            persons.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          className="form-control"
                          id="todoAttachments"
                          multiple
                          {...register("numberOfAttachments", {
                            onChange: handleFileSelection,
                          })}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            setSelectedFiles([]);
                            setValue("numberOfAttachments", []);
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="file-list" id="attachmentPreview">
                        <ul className="list-group" id="fileList">
                          {selectedFiles.map((file, idx) => (
                            <li
                              className="list-group-item border-0 p-0"
                              key={file.name + file.lastModified + idx}
                            >
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        {editingTodo ? "Update Task" : "Add Task"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Tasks</h5>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      title="Filter"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-funnel"></i>
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onFilter("")}
                        >
                          <i> Clear filter </i>
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onFilter("completed")}
                        >
                          Completed
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onFilter("in-progress")}
                        >
                          In-progress
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onFilter("pending")}
                        >
                          Pending
                        </button>
                      </li>
                    </ul>

                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      title="Sort"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-sort-down"></i>
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onSort("")}
                        >
                          <i>No sorting</i>
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => onSort("dueAsc")}
                        >
                          Due Date ↑
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onSort("dueDesc")}
                        >
                          Due Date ↓
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onSort("title")}
                        >
                          Title A–Z
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onSort("assignee")}
                        >
                          Assignee
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onSort("created")}
                        >
                          Created
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {/* Start of conditional rendering */}

                    {getVisibleTodos().length === 0 ? (
                      <li className="list-group-item border p-3">
                        No items in your Todolist
                      </li>
                    ) : (
                      getVisibleTodos().map((todo) => (
                        <div
                          className="list-group-item list-group-item-action"
                          key={todo.id}
                        >
                          <div className="d-flex w-100 justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1">{todo.title}</h6>
                                <small className="text-muted ms-2">
                                  Created: {todo.createdAt.slice(0, 10)}
                                </small>
                              </div>
                              <p className="mb-1 text-muted small">
                                {todo.description}
                              </p>
                              <div className="d-flex align-items-center flex-wrap">
                                <small className="text-muted me-2">
                                  <i className="bi bi-calendar-event"> </i>
                                  Due: {todo.dueDate.slice(0, 10)}
                                </small>

                                {todo.personId && (
                                  <span className="badge bg-info me-2">
                                    <i className="bi bi-person">
                                      {getPersonName(todo.personId)}
                                    </i>
                                  </span>
                                )}

                                <span
                                  className={`badge ${
                                    !todo.completed
                                      ? todo.personId
                                        ? "bg-primary"
                                        : "bg-warning text-dark"
                                      : "bg-success"
                                  }  me-2`}
                                >
                                  {!todo.completed
                                    ? todo.personId
                                      ? "in-progress"
                                      : "pending"
                                    : "completed"}
                                </span>
                              </div>
                            </div>
                            <div className="btn-group ms-3">
                              <button
                                className="btn btn-outline-success btn-sm"
                                title="Complete"
                                onClick={() => onMarkComplete(todo)}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                title="Edit"
                                onClick={() => OnEdit(todo)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete"
                                onClick={() => OnDelete(todo.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* End of conditional rendering */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Task;
