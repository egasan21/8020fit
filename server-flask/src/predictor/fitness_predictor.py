import joblib
from typing import Dict, Any

class FitnessPredictor:
    def __init__(self, models_dir: str = 'src/models/fitness_models'):
        """Initialize the predictor by loading all saved models and preprocessors"""
        self.label_encoders = joblib.load(f'{models_dir}/label_encoders.joblib')
        self.scalers = joblib.load(f'{models_dir}/scalers.joblib')
        self.equipment_model = joblib.load(f'{models_dir}/equipment_model.joblib')
        self.diet_model = joblib.load(f'{models_dir}/diet_model.joblib')
        self.exercises_model = joblib.load(f'{models_dir}/exercises_model.joblib')
        self.recommendation_model = joblib.load(f'{models_dir}/recommendation_model.joblib')

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, str]:
        """Make predictions using the loaded models"""
        processed_data = input_data.copy()
        
        for feature, encoder in self.label_encoders.items():
            if feature not in ['Equipment', 'Diet', 'Exercises', 'Recommendation'] and feature in processed_data:
                processed_data[feature] = encoder.transform([processed_data[feature]])[0]
        
        for feature, scaler in self.scalers.items():
            if feature in processed_data:
                processed_data[feature] = scaler.transform([[processed_data[feature]]])[0][0]
        
        features_list = list(processed_data.values())
        equipment_pred = self.label_encoders['Equipment'].inverse_transform([self.equipment_model.predict([features_list])[0]])[0]
        diet_pred = self.label_encoders['Diet'].inverse_transform([self.diet_model.predict([features_list])[0]])[0]
        exercises_pred = self.label_encoders['Exercises'].inverse_transform([self.exercises_model.predict([features_list])[0]])[0]
        recommendation_pred = self.label_encoders['Recommendation'].inverse_transform([self.recommendation_model.predict([features_list])[0]])[0]
        
        return {
            'Equipment': equipment_pred,
            'Diet': diet_pred,
            'Exercises': exercises_pred,
            'Recommendation': recommendation_pred
        }