from flask import Flask, request, jsonify
from predictor.fitness_predictor import FitnessPredictor

app = Flask(__name__)
predictor = FitnessPredictor()

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.json
    
    if not input_data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        predictions = predictor.predict(input_data)
        return jsonify(predictions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)