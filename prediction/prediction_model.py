import os
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# Define image dimensions
img_width = 224
img_height = 224

# Load the trained model
model_path = 'apple_disease_model.keras'  # Correct path
model = load_model(model_path)

# Load treatment data
treatments_file = 'treatments.json'  # Correct path
with open(treatments_file, "r") as f:
    treatment_data = json.load(f)

def predict_image(image_path, img_width, img_height):
    try:
        img = image.load_img(image_path, target_size=(img_width, img_height))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add a batch dimension
        img_array /= 255.0  # Normalize

        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)  # Get the class with the highest probability
        return predicted_class
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None  # Or handle the error as needed


# Example usage:
image_path = r'C:\Users\siddh\Projects\New folder\prediction_image_for_model_test/images3.jpg'  # Correct path

if os.path.exists(image_path):
    predicted_class = predict_image(image_path, img_width, img_height)

    if predicted_class is not None:
        try:
            train_dir = r'C:\Users\siddh\Projects\New folder\preprocessed_data\train'  # Correct path
            class_names = os.listdir(train_dir)
            predicted_class_name = class_names[predicted_class]

            if predicted_class_name in treatment_data:
                treatments = treatment_data[predicted_class_name]["treatments"]
                general_advice = treatment_data[predicted_class_name].get("general_advice", [])

                print(f"Predicted class: {predicted_class_name}")
                print("\nTreatment Suggestions:")
                for treatment in treatments:
                    print(f"- {treatment['name']}: {treatment['description']}")
                    print(f"  Long-term Effectiveness: {treatment['long_term_effectiveness']}")
                    print("  Sources:")
                    for source in treatment['sources']:
                        print(f"    - {source}")
                    print()

                if general_advice:
                    print("General Advice:")
                    for advice_item in general_advice:
                        print(f"- {advice_item['advice']}")
                        if "links" in advice_item:
                            for link in advice_item["links"]:
                                print(f"  - Learn more: {link}")
                        print()

            else:
                print(f"No treatment information found for {predicted_class_name}")

        except IndexError:
            print(f"Error: Predicted class index {predicted_class} is out of range.")
        except FileNotFoundError:
            print(f"Error: Training directory not found at {train_dir} or {treatments_file}")  # Include treatments file
    else:
        print("Prediction failed. Check image processing errors.")
else:
    print(f"Error: Image file not found at {image_path}")