import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const keyGenerator = useRef(0);
    const [todoList, setTodoList] = useState([]);
    const [todoItem, setTodoItem] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setTodoList(todoList.concat([
            {key: keyGenerator.current++, value: e.target.todoItem.value}
            ]));
        setTodoItem("");
    }

    const handleDelete = (e, key) => {
        e.preventDefault();
        setTodoList(todoList.filter((el)=>el.key!==key));
    }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
          <label>
              Todo Item:
              <input
                  type="text"
                  name="todoItem"
                  value={todoItem}
                  onChange={e => setTodoItem(e.target.value)}
              />
              <ul>
                  {todoList.map((todoListItem)=>
                      <li key={todoListItem.key}>
                          {todoListItem.value}
                          {" "}
                          <a
                              role="button"
                              href={"#"+todoListItem.key}
                              onClick={(e)=> handleDelete(e, todoListItem.key)}
                          >x</a>
                      </li>
                  )}
              </ul>
          </label>
      </form>
    </div>
  );
}

export default App;
