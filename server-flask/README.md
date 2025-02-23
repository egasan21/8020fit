# README.md

# Fitness API

## Overview

The Fitness API is a Flask-based web application that provides personalized fitness recommendations based on user input. It utilizes machine learning models to predict suitable equipment, diet, exercises, and additional recommendations for users aiming to achieve their fitness goals.

## Project Structure

```
fitness-api
├── src
│   ├── app.py                  # Entry point of the Flask application
│   ├── predictor
│   │   └── fitness_predictor.py # Contains the FitnessPredictor class for predictions
│   ├── utils
│   │   └── validation.py        # Utility functions for input validation
│   ├── models
│   │   └── fitness_models
│   │       ├── label_encoders.joblib
│   │       ├── scalers.joblib
│   │       ├── equipment_model.joblib
│   │       ├── diet_model.joblib
│   │       ├── exercises_model.joblib
│   │       └── recommendation_model.joblib
│   └── config.py               # Configuration settings for the Flask application
├── requirements.txt             # Project dependencies
├── .env                         # Environment variables
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fitness-api
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and add any necessary environment variables.

## Usage

1. **Run the Flask application:**
   ```bash
   python src/app.py
   ```

2. **Make a POST request to the `/predict` endpoint with user data in JSON format:**
   ```json
   {
       "Sex": "Male",
       "Hypertension": "No",
       "Diabetes": "No",
       "Level": "Normal",
       "Fitness Goal": "Weight Loss",
       "Fitness Type": "Cardio Fitness",
       "Age": 25,
       "Height": 1.75,
       "Weight": 70
   }
   ```

3. **Receive predictions in JSON format:**
   The response will include recommended equipment, diet, exercises, and additional recommendations.

## License

This project is licensed under the MIT License. See the LICENSE file for details.