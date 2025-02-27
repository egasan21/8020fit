import React from 'react'
import Navbar from './components/Navbar'
import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();


  return (
    <main>
      <div className="logo-container">
        <img src="src\assets\favicon.ico" alt = "Logo" className="logo"></img>
      </div>

      <h1>Welcome to {user?.signInDetails?.loginId}'s Home Page!</h1>
    
      <div>
        <Navbar />
      </div>

      <div>
        🥳 Starting template for a Fitness webapp.
        <br />
        <a href="https://github.com/htmw/2025SA-Team2">
          Please visit our GitHub page. Thank you.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      
    </main>
  );
}

export default App;
/*test commit for aws amplify*/ 