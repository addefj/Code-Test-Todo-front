export const getPersonName = (id, persons) => {
  const person = persons.find((p) => p.id === id);
  return person ? person.name : "";
};

export const sortPersons = (sortType, visible) => {
  switch (sortType) {
    case "nameAsc":
      console.log("Sorting by name in ascending order");
      return [...visible].sort((a, b) => a.name.localeCompare(b.name));
    case "nameDesc":
      console.log("Sorting by name in descending order");
      return [...visible].sort((a, b) => b.name.localeCompare(a.name));
    case "id":
      console.log("Sorting by id");
      return [...visible].sort((a, b) => a.personId - b.personId);
    case "email":
      console.log("Sorting by email in ascending order");
      return [...visible].sort((a, b) => a.email.localeCompare(b.email));
    default:
      return visible;
  }
};

//Need to implement role assigning/fetching in backend before using this
export const filterPersons = (filterType, visible) => {
  switch (filterType) {
    case "user":
      console.log("Filtering by user role");
      return [...visible].filter((person) => person.role === USER);
    case "admin":
      console.log("Filtering by admin role");
      return [...visible].filter((person) => person.role === ADMIN);
    case "moderator":
      console.log("Filtering by moderator role");
      return [...visible].filter((person) => person.role === MODERATOR);
    default:
      return visible;
  }
};
