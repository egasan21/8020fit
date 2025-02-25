import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { signIn, signUp, confirmSignUp, fetchAuthSession, signOut, getCurrentUser } from "@aws-amplify/auth";
import React, { useState } from "react";
import Onboarding from "./components/Onboarding";

Amplify.configure(awsExports);

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userSignedIn, setUserSignedIn] = useState(false);

    // Sign Out Function
    const handleSignOut = async () => {
        try {
            await signOut(); // Amplify sign out
            console.log("User signed out successfully");
            setUserSignedIn(false); // Navigate to Sign In page
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const handleSignIn = async () => {
        try {
            const user = await signIn({ username: email, password });
            console.log("User signed in:", user);
            setUserSignedIn(true);
        } catch (error) {
            console.error("Sign in error:", error);
        }
    };

    const handleSignUp = async () => {
        try {
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email: email,
                    },
                },
            });
            setShowConfirmation(true);
        } catch (error) {
            console.error("Sign up error:", error);
        }
    };

    const handleConfirmSignUp = async () => {
        try {
            await confirmSignUp({
                username: email,
                confirmationCode,
            });
            console.log("User confirmed successfully!");
            setIsSignUp(false);
        } catch (error) {
            console.error("Confirmation error:", error);
        }
    };

    const handleOnboardingSubmit = async (userData) => {
      console.log("Submitting user data:", userData);
      try {
          // Step 1: Ensure user is authenticated
          const user = await getCurrentUser(); // ✅ Verify if the user is authenticated
          console.log("Authenticated User:", user);
  
          // Step 2: Get the session and extract the token
          const session = await fetchAuthSession(); // ✅ Get the authentication session
          const token = session.tokens?.idToken?.toString(); // ✅ Extract the ID Token
  
          if (!token) {
              throw new Error("Authentication token is missing");
          }
          console.log("Auth Token:", token);
  
          // Step 3: Make the POST request to API Gateway
          const response = await fetch(API_URL, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // ✅ Pass token in Authorization header
              },
              body: JSON.stringify(userData),
          });
  
          const result = await response.json();
          console.log("Profile saved:", result);
      } catch (error) {
          console.error("Error saving user data:", error);
      }
  };

    const API_URL = "https://b6ug3cal1b.execute-api.us-east-1.amazonaws.com/dev/profile";

    return (
        <div>
            <h1>Onboarding Quiz</h1>

            {!userSignedIn ? (
                <div>
                    <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {isSignUp && showConfirmation ? (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter confirmation code"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                            />
                            <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
                        </div>
                    ) : (
                        <button onClick={isSignUp ? handleSignUp : handleSignIn}>
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    )}

                    <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: "pointer", color: "blue" }}>
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </p>
                </div>
            ) : (
                <div>
                    <Onboarding onSubmit={handleOnboardingSubmit} />
                    {/* Sign Out Button */}
                    <button onClick={handleSignOut} style={{ marginTop: "20px", background: "red", color: "white" }}>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
