import React, { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
// Notice we import the same client you've seen in your code:
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; // <-- your generated schema
import { useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();

function Quiz(): JSX.Element {
  const navigate = useNavigate();

  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [goals, setGoals] = useState<string>('');
  const [workoutPreference, setWorkoutPreference] = useState<string>('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // 1. Get the signed-in user so we know who is creating this record
      const currentUser = await getCurrentUser();
      const userID = currentUser.userId; // The unique user id

      // 2. Create a new OnboardingData record in DynamoDB
      await client.models.OnboardingData.create({
        userID: userID,
        age: parseInt(age, 10),
        height: height,
        weight: weight,
        goals: goals,
        workoutPreference: workoutPreference,
      });

      console.log('Onboarding data stored in DynamoDB!');
      // 3. Redirect or show success message
      navigate('/');
    } catch (error) {
      console.error('Error creating OnboardingData record:', error);
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Onboarding Quiz</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <label>Height:</label>
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />

        <label>Weight:</label>
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />

        <label>Fitness Goals:</label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          required
        />
                <label>Workout Preference:</label>
        <select
          value={workoutPreference}
          onChange={(e) => setWorkoutPreference(e.target.value)}
          required
        >
          <option value="">Select...</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
          <option value="HIIT">HIIT</option>
          {/* Add more options as desired */}
        </select>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Submit Onboarding
        </button>
      </form>

      <br />
      <button onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
}

export default Quiz;
