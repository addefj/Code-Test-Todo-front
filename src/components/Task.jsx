import React, { useEffect, useState } from "react";
import "./Task.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import axios from "axios";
import { useForm } from "react-hook-form";

const Task = () => {
  // todo*: make this component functional by implementing state management and API calls
  const apiEndpoint = "http://localhost:9090/api/todo";
  const token = localStorage.getItem("auth_token");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchAllTasks();
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

  const [selectedFiles, setSelectedFiles] = useState([]); // State to hold selected attachments

  const handleFileSelection = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(newFiles);
  };

  const OnDelete = async (id) => {
    console.log("Delete task with id: ", id);
    try {
      const response = await axios.delete(apiEndpoint + "/" + id, {
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


  const onSubmit = async (data) => {
    data.numberOfAttachments = data.numberOfAttachments.length; // Update to reflect number of files

    console.log("Form Data Submitted: ", data);

    try {
      const response = await axios.post(apiEndpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        console.log("Task successfully created:", response.data);
        reset(); // Reset the form after successful submission
        setSelectedFiles([]); // Clear selected files
        fetchAllTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error("There was an error creating the task!", error);
    }
  };

  const fetchAllTasks = async () => {
    console.log("Started Fetching tasks");

    await axios
      .get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response: ", response);
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
                            value: 20,
                            message:
                              "Description must be at least 20 characters",
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
                          <option value="1">Mehrdad Javan</option>
                          <option value="2">Simon Elbrink</option>
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
                        Add Task
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
                      className="btn btn-outline-secondary btn-sm"
                      title="Filter"
                    >
                      <i className="bi bi-funnel"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Sort"
                    >
                      <i className="bi bi-sort-down"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {/* Start of conditional rendering */}

                    {todos.length === 0 ? (
                      <li className="list-group-item border p-3">
                        No items in your Todolist
                      </li>
                    ) : (
                      todos.map((todo) => (
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
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person"></i>
                                  Placeholder for Assignee
                                </span>
                                <span
                                  className={`badge ${
                                    todo.completed ? "bg-success" : "bg-warning"
                                  } text-dark me-2`}
                                >
                                  {todo.completed ? "completed" : "in progress"}
                                </span>

                                {todo.numberOfAttachments &&
                                todo.numberOfAttachments.length == 0 ? (
                                  <span className="badge bg-secondary me-2">
                                    {todo.numberOfAttachments.length} attachment
                                    {todo.numberOfAttachments.length > 1
                                      ? "s"
                                      : ""}
                                  </span>
                                ) : (
                                  ""
                                )}
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
