import React from 'react'
import Navbar from './components/Navbar'
import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Quiz from './pages/Quiz';
import Workout from './pages/Workout';
import AIchatbot from './pages/AIchatbot';

const App: React.FC = () => {
  return (
    <Authenticator>
      <Router>
        <NavigationBar />
        <ProtectedRoutes />
      </Router>
    </Authenticator>
  );
};

// ✅ This function ensures users are signed in before accessing pages
const ProtectedRoutes: React.FC = () => {
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
        🥳 Starting template for a Fitness webapp!
        <br />
        <a href="https://github.com/htmw/2025SA-Team2">
          Please visit our GitHub page. Thank you.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      
    </main>
  );
};

export default App;
