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

<<<<<<< HEAD
const App: React.FC = () => {
  return (
    <Authenticator>
      <Router>
        <NavigationBar />
        <ProtectedRoutes />
      </Router>
    </Authenticator>
  );
      <div>
        <Navbar />
        <div className='container'>
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
<<<<<<< HEAD
};

export default App;
=======
}

export default withAuthenticator(App);
>>>>>>> b0187cd3853238963105e94191dcb35c9653b715
