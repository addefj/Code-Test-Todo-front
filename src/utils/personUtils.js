 export const getPersonName = (id, persons) => {
    const person = persons.find((p) => p.id === id);
    return person ? person.name : "";
  };
