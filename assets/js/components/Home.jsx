import React, { useContext, useEffect, useState } from "react";
import "../../css/app.css";

export default function Home (){

    const [todoList, setTodoList] = useState([]);
    const [todo, setTodo] = useState()

    useEffect(() => {
        GetTodo()
    }, [])

    async function GetTodo(){
        const response = await fetch('https://127.0.0.1:8001/api/todo');
        if (response.ok){
            const todo = await response.json();
            setTodoList(todo);
        }
    }

    function handleChange (e){
        setTodo(e.target.value)
    }

    async function addTodo(){
        const response = await fetch('https://127.0.0.1:8001/api/todo/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: todo,
                done: false,
                edit: false
            })
        })

        if(response.ok){
            const todo = await response.json();
            console.log('Nouveau todo ajouté :', todo);
        }
    }

    async function handlDelete(){
        const response = await fetch('https://127.0.0.1:8001/api/todo/delete', {
            method: 'DELETE'
        })
    }

    console.log(todoList);
    return (
        <div className="container">
            <div className="todo">
                <h1>Todo App with API by Symfony</h1>
                <div className="input-todo">
                    <input type="text" value={todo} onChange={handleChange}/>
                    <button className="add" onClick={addTodo}>ADD</button>
                </div>
                    <div className="list-todo">
                        <ul>
                            {
                                todoList.map((m) =>       
                                <li key={m.id}>{m.title} 
                                    <div> 
                                        <button className="delete">Supprimer</button> 
                                        <span className="verticale">|</span>
                                        <button className="edit">Modifier</button>
                                    </div>
                                </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
    )
}

/*



<div className="info">
                            <input type="checkbox" id="todo"/>
                            <label htmlFor="todo">Test</label>
                        </div>

                        <div className="action">
                            <button className="edit">Modifier</button>
                            <span className="verticale">|</span>
                            <button className="delete">Supprimer</button>
                        </div>*/