import axios from "axios";

const apiEndpointPerson = "http://localhost:9090/api/person";

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