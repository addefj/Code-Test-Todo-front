//*todo: implement taskService and call the API
import axios from "axios";

const apiEndpointTodo = "http://localhost:9090/api/todo";
const apiEndpointPerson = "http://localhost:9090/api/person";

export const getTodos = (token) => {
  return axios.get(apiEndpointTodo, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTodo = (formData, token) => {
  return axios.post(apiEndpointTodo, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editTodo = (editingTodo, data, token) => {
  return axios.put(apiEndpointTodo + "/" + editingTodo.id, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCompleteStatus = (formData, id, token) => {
  return axios.put(apiEndpointTodo + "/" + id, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTodo = (id, token) => {
  return axios.delete(apiEndpointTodo + "/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPersons = (token) => {
  return axios.get(apiEndpointPerson, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createPerson = (person, token) => {
  return axios.post(apiEndpointPerson + "/register", person, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePerson = (id, token) => {
  return axios.delete(apiEndpointPerson + "/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};