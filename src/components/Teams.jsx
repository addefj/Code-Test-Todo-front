import React, { useEffect, useState } from "react";
import "./Task.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import { useForm } from "react-hook-form";
import { getPersons, createPerson, deletePerson } from "../services/taskService.js";

const Teams = () => {
  const [persons, setPersons] = useState([]);

  const token = localStorage.getItem("auth_token");
  useEffect(() => {
    fetchAllPersons();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const onSubmit = async (person) => {
    console.log("Person", person);
    try {
      const response = await createPerson(person, token);
      if (response.status === 201) {
        console.log("Person successfully created", response.data);
      }
      reset();
      fetchAllPersons();
    } catch (error) {
      console.error("There was an error creating the person!", error);
    }
  };

  const onDelete = async (id) => {
      try {
        console.log("Delete person with id: ", id);
        const response = await deletePerson(id, token);
        if (response.status === 204) {
          console.log("Person successfully deleted", response.data);
          fetchAllPersons(); // Refresh the person list
        }
      } catch (error) {
        console.error("There was an error deleting the person!", error);
      }
    };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />
      <main className="dashboard-main">
        <Header
          title="Team"
          subtitle="Manage and organize your team"
          onToggleSidebar={() => {}}
        />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              {/* Start of form */}
              <div className="card shadow-sm task-form-section">
                <div className="card-body">
                  <h2 className="card-title mb-4">Add New User</h2>
                  <form id="personForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Name can not be more than 100 characters",
                            },
                          })}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          id="username"
                          {...register("username", {
                            required: "Username is required",
                            minLength: {
                              value: 4,
                              message: "Username must be at least 4 characters",
                            },
                            maxLength: {
                              value: 50,
                              message:
                                "Username can not be more than 50 characters",
                            },
                          })}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        {...register("email", {
                          required: "Email is required",
                          minLength: {
                            value: 5,
                            message: "Email must be at least 5 characters",
                          },
                          maxLength: {
                            value: 150,
                            message:
                              "Email can not be more than 150 characters",
                          },
                        })}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          id="password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Password can not be more than 100 characters",
                            },
                          })}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          id="confirmPassword"
                          {...register("confirmPassword", {
                            required: "Confirm password is required",

                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Password can not be more than 100 characters",
                            },
                          })}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Person
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* Start of personlist */}
              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Team</h5>
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
                        <button className="dropdown-item">
                          <i> Clear filter </i>
                        </button>
                      </li>

                      <li>
                        <button className="dropdown-item">User</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Admin</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Moderator</button>
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
                        <button className="dropdown-item">
                          <i>No sorting</i>
                        </button>

                        <button className="dropdown-item">Name ↑</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Name ↓</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Id</button>
                      </li>
                      <li>
                        <button className="dropdown-item">Email</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {/* Start of conditional rendering */}
                    <div className="table-responsive">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {persons.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No persons in your team
                              </td>
                            </tr>
                          ) : (
                            persons.map((person) => (
                              <tr key={person.id}>
                                <td>{person.id}</td>
                                <td>{person.name}</td>
                                <td>{person.email}</td>

                                <td className="text-end">
                                  <div className="btn-group ms-3">
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete"
                                      onClick={() => onDelete(person.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

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

export default Teams;
