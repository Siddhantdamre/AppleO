import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2

# 1. Define Image Path
image_path = r'C:\Users\siddh\Projects\New folder\preprocessed_data\train\apple_scab\0a5e9323-dbad-432d-ac58-d291718345d9___FREC_Scab 3417_90deg.npy'  # Replace with your image path

# 2. Load the Preprocessed Image
try:
    image = np.load(image_path)
    print("Image loaded successfully")
except Exception as e:
    print(f"Error loading image: {e}")
    exit()

# 3. Expand Dimensions and Normalize
# Add a batch dimension, as the model expects a batch of images
image = np.expand_dims(image, axis=0)

# 4. Load the Trained Model
model_path = 'apple_disease_model.keras'  # Replace with your model path

try:
    model = load_model(model_path)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

# 5. Make a Prediction
predictions = model.predict(image)
print("Raw Predictions:", predictions)

# 6. Get the Predicted Class
predicted_class = np.argmax(predictions[0])  # Index of the highest probability
print("Predicted Class Index:", predicted_class)

# 7. Define Class Names (Mapping)
class_names = ['apple_scab', 'black_rot', 'cedar_apple_rust', 'healthy']  # Ensure correct order

# 8. Get the Class Name
predicted_class_name = class_names[predicted_class]
print("Predicted Class Name:", predicted_class_name)