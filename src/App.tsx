import React from 'react';
import type { Schema } from "../amplify/data/resource";
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Onboarding from './Onboarding';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();

  return (
<Router>
      <Routes>
        {/* Default route ("/"): shows a button to go to Onboarding */}
        <Route
          path="/"
          element={
            <div style={{ padding: '1rem' }}>
              <h2>Welcome </h2>
              <Link to="/onboarding">
                <button>Start Onboarding Quiz</button>
              </Link>

              <br /><br />
              <button onClick={signOut}>Sign Out</button>
            </div>
          }
        />

        {/* Route for our Onboarding Quiz page */}
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
