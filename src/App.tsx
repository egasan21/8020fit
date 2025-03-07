import React from 'react';
import type { Schema } from "../amplify/data/resource";
import Navbar from './components/Navbar'
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Quiz from './pages/Quiz';
import Workout from './pages/Workout';
import AIchatbot from './pages/AIchatbot';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();


  return (
    <main>
     
      <div>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/Quiz' element={<Quiz />} />
            <Route path='/Workout' element={<Workout />} />
            <Route path='/AIchatbot' element={<AIchatbot />} />
          </Routes>
        </div>
      </div>

      

      <div>
        🥳 Enjoy Being Healthy
        <br />
        <a href="https://github.com/htmw/2025SA-Team2">
          Please visit our GitHub page. Thank you.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      
    </main>
  );
}

export default withAuthenticator(App);
