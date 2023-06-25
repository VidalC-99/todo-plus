import React, { useEffect, useState } from "react";
import "../../css/app.css";

export default function Home() {
  const [todoList, setTodoList] = useState([]);
  const [value, setValue] = useState("");
  const [valueTodo, setValueTodo] = useState("");

  useEffect(() => {
    async function getTodo() {
      try {
        const response = await fetch("https://127.0.0.1:8001/api/todo");
        if (response.ok) {
          const todoResponse = await response.json();
          setTodoList(todoResponse);
          console.log("OK");
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des todos :", error);
      }
    }

    getTodo();
  }, []);

  function handleChange(e) {
    setValue(e.target.value);
  }

  async function handleAddTodo() {
    try {
      const response = await fetch("https://127.0.0.1:8001/api/todo/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: value,
          edit: false,
          done: false
        })
      });

      if (response.ok) {
        const todoResponse = await response.json();
        console.log("Nouveau todo ajouté :", todoResponse);
        setTodoList([...todoList, todoResponse]);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout du todo :", error);
    }

    setValue("");
  }

  async function handleDelete(id) {
    try {
      const todoDelete = todoList.find(m => m.id === id);
      console.log(todoDelete);

      const response = await fetch(`https://127.0.0.1:8001/api/todo/delete/${todoDelete.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        console.log("Todo " + todoDelete.id + " supprimé");
        deleteTodo(todoDelete.id);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  function deleteTodo(id) {
    const updatedTodoList = todoList.filter(m => m.id !== id);
    setTodoList(updatedTodoList);
  }

  async function handleCheck(id) {
    const todoToUpdate = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });

    setTodoList(todoToUpdate);

    try {
      const response = await fetch(`https://127.0.0.1:8001/api/todo/editDone/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: todoToUpdate.find(todo => todo.id === id)?.done })
      });

      if (response.ok) {
        console.log("Todo " + id + " mis à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  }

  async function handleEdit(id) {
    const todoToUpdate = todoList.map(todo => {
      if (todo.id === id) {
        setValueTodo(todo.title);
        return { ...todo, edit: !todo.edit };
      }
      return todo;
    });

    setTodoList(todoToUpdate);

    try {
      const response = await fetch(`https://127.0.0.1:8001/api/todo/editMode/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ edit: todoToUpdate.find(todo => todo.id === id)?.edit })
      });

      if (response.ok) {
        console.log("Todo " + id + " mis à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  }

  async function saveChange(id) {
    const todoToUpdate = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, title: valueTodo };
      }
      return todo;
    });

    setTodoList(todoToUpdate);

    try {
      const response = await fetch(`https://127.0.0.1:8001/api/todo/editTitle/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: todoToUpdate.find(todo => todo.id === id)?.title })
      });

      if (response.ok) {
        console.log("Todo " + id + " mis à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  }

  function handleSave(id) {
    saveChange(id);
    handleEdit(id);
  }

  function handleChangeEdit(e) {
    setValueTodo(e.target.value);
  }

  return (
    <div className="container">
      <div className="todo">
        <h1>Todo App with API by Symfony</h1>
        <div className="input-todo">
          <input type="text" value={value} onChange={handleChange} />
          <button className="add" onClick={handleAddTodo}>
            ADD
          </button>
        </div>
        <div className="list-todo">
          <ul>
            {todoList.map(m => (
              <li key={m.id}>
                <div>
                  <input type="checkbox" className="check" checked={m.done} onChange={() => handleCheck(m.id)} />
                  {!m.edit ? m.title : <input type="text" onChange={handleChangeEdit} value={valueTodo} />}
                </div>
                <div>
                  {!m.edit ? (
                    <>
                      <button className="delete" onClick={() => handleDelete(m.id)}>
                        Supprimer
                      </button>
                      <span className="verticale">|</span>
                      <button className="edit" onClick={() => handleEdit(m.id)}>
                        Modifier
                      </button>
                    </>
                  ) : (
                    <button className="save" onClick={() => handleSave(m.id)}>
                      Enregistrer
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
