
export const sortTodos = (sortType, visible) => {
  switch (sortType) {
    case "dueAsc":
      console.log("Sorting by due date ascending");
      return [...visible].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    case "dueDesc":
      console.log("Sorting by due date descending");
      return [...visible].sort(
        (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
      );
    case "title":
      console.log("Sorting by title A-Z");
      return [...visible].sort((a, b) => a.title.localeCompare(b.title));
    case "assignee":
      console.log("Sorting by personId");
      return [...visible].sort((a, b) => a.personId - b.personId);
    case "created":
      console.log("Sorting by created date");
      return [...visible].sort(
        (a, b) => new Date(a.created) - new Date(b.createdAt)
      );
    default:
      return visible;
  }
};

export const filterTodos = (filterType, visible) => {
  switch (filterType) {
    case "completed":
      console.log("Filtering by completed status");
      return [...visible].filter((todo) => todo.completed === true);
    case "in-progress":
      console.log("Filtering by in-progress status");
      return [...visible].filter((todo) => !todo.completed && todo.personId);
    case "pending":
      console.log("Filtering by pending status");
      return [...visible].filter((todo) => !todo.personId);
    default:
      return visible;
  }
};
