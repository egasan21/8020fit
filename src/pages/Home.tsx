import React from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react';


const Home = () => {
    const { user} = useAuthenticator();
    return(
        <div>
            <h1>Welcome to {user?.signInDetails?.loginId}'s Home Page!</h1>

        </div>
    )
}

export default Home