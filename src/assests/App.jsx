import { useEffect, useState } from 'react';
import Navbar from './assets/Navbar';
import { v4 as uuidv4 } from 'uuid';
import Login from './assets/Login.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let savedTodos = JSON.parse(todoString);
      setTodos(savedTodos);
    }
  }, []);

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS();
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS();
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  // ✅ Login → Todo switch
  if (!isLoggedIn) {
    return (
      <Login onLogin={(email) => {
        setUserEmail(email);
        setIsLoggedIn(true);
      }} />
    );
  }

  return (
    <>
      <Navbar />
      <div className='container mx-auto my-5 rounded-xl p-5 bg-violet-200 min-h-[80vh]'>
        <h1 className='font-bold text-center text-xl'>
          Welcome {userEmail} - iTask manages your todos
        </h1>
        <div className='addTodo my-5'>
          <h2 className='text-lg font-bold'>Add a Todo</h2>
          <input onChange={handleChange} value={todo} type="text" className='w-1/2' />
          <button onClick={handleAdd} disabled={todo.length <= 3}
            className='bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-6'>
            Save
          </button>
        </div>

        <input onChange={toggleFinished} type='checkbox' checked={showFinished} /> Show Finished
        <h2 className='text-xl font-bold'>Your Todos</h2>
        <div className='todos'>
          {todos.length === 0 && <div className='m-5'>No Todos to Display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) &&
            <div key={item.id} className='todo flex w-1/4 my-3 justify-between'>
              <div className='flex gap-5'>
                <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className='buttons flex h-full'>
                <button onClick={(e) => handleEdit(e, item.id)}
                  className='bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                  Edit
                </button>
                <button onClick={(e) => { handleDelete(e, item.id) }}
                  className='bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
