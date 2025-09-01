//*todo: implement taskService and call the API

export const sortTodos = (sortType, todos) => {
    console.log(todos);
  switch (sortType) {
    case "dueAsc":
      console.log("Sorting by due date ascending");
      return [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    case "dueDesc":
      console.log("Sorting by due date descending");
      return [...todos].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    case "title":
      console.log("Sorting by title A-Z");
      return [...todos].sort((a, b) => a.title.localeCompare(b.title));
    case "assignee":
      console.log("Sorting by personId");
      return [...todos].sort((a, b) => (a.personId - b.personId));
    case "created":
      console.log("Sorting by created date");
      return [...todos].sort((a, b) => new Date(a.created) - new Date(b.createdAt));
    default:
      return todos;
  }
};