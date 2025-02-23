def validate_user_input(input_data):
    required_fields = {
        'Sex': str,
        'Hypertension': str,
        'Diabetes': str,
        'Level': str,
        'Fitness Goal': str,
        'Fitness Type': str,
        'Age': (int, float),
        'Height': (int, float),
        'Weight': (int, float)
    }

    for field, expected_type in required_fields.items():
        if field not in input_data:
            raise ValueError(f"Missing required field: {field}")
        if not isinstance(input_data[field], expected_type):
            raise ValueError(f"Field '{field}' must be of type {expected_type.__name__}")

    if input_data['Sex'] not in ['Male', 'Female']:
        raise ValueError("Field 'Sex' must be either 'Male' or 'Female'")
    if input_data['Hypertension'] not in ['Yes', 'No']:
        raise ValueError("Field 'Hypertension' must be either 'Yes' or 'No'")
    if input_data['Diabetes'] not in ['Yes', 'No']:
        raise ValueError("Field 'Diabetes' must be either 'Yes' or 'No'")
    if input_data['Level'] not in ['Underweight', 'Normal', 'Overweight', 'Obuse']:
        raise ValueError("Field 'Level' must be one of 'Underweight', 'Normal', 'Overweight', 'Obuse'")
    if input_data['Fitness Goal'] not in ['Weight Gain', 'Weight Loss']:
        raise ValueError("Field 'Fitness Goal' must be either 'Weight Gain' or 'Weight Loss'")
    if input_data['Fitness Type'] not in ['Muscular Fitness', 'Cardio Fitness']:
        raise ValueError("Field 'Fitness Type' must be either 'Muscular Fitness' or 'Cardio Fitness'")