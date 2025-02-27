import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>Welcome to {user?.signInDetails?.loginId}'s Home Page!</h1>
      <button onClick={createTodo}>+ new</button>

      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        ))}
      </ul>

      <button> AI Chat Bot</button>

      <button> Workout </button>

      <button> Quiz </button>

      <button> Settings </button>

      <button onClick={signOut}>Sign out</button>
      <br />


      <div>
        🥳 Starting template for a Fitness webapp.
        <br />
        <a href="https://github.com/htmw/2025SA-Team2">
          Please visit our GitHub page. Thank you.
        </a>
      </div>
      
    </main>
  );
}

export default App;
/*test commit for aws amplify*/ 