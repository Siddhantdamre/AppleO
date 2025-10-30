import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Input
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.metrics import confusion_matrix, classification_report  # Import classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import json

# ***CORRECT PATH TO THE PARENT OF PREPROCESSED DATA FOLDERS***
base_dir = r'C:\Users\siddh\Projects\New folder\apple_disease_split'  # <--- IMPORTANT: Verify this path!
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')
test_dir = os.path.join(base_dir, 'test')

# Define image parameters
img_width, img_height = 224, 224
num_classes = 4  # apple_scab, black_rot, cedar_apple_rust, healthy
batch_size = 32  # You can adjust this if you have memory issues
epochs = 20

# Data generators (using flow_from_directory - recommended)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='sparse',
    shuffle=True  # Shuffle training data
)

validation_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='sparse',
    shuffle=False  # Don't shuffle validation data
)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='sparse',
    shuffle=False  # Important: Don't shuffle test data for confusion matrix
)


# Load pre-trained ResNet50
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(img_width, img_height, 3))

# Add custom classification layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.5)(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Callbacks
early_stopping = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)  # Increased patience
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.00001)  # Reduced min_lr
model_checkpoint = ModelCheckpoint(
    filepath='best_apple_disease_model.keras',
    monitor='val_loss',
    save_best_only=True,
    save_weights_only=False,
    verbose=1
)

# Class weights to handle imbalance
total_samples = sum([len(files) for r, d, files in os.walk(train_dir)])
class_weights = {}
for i, class_name in enumerate(os.listdir(train_dir)):
    class_path = os.path.join(train_dir, class_name)
    num_samples = len(os.listdir(class_path))
    class_weights[i] = total_samples / (num_classes * num_samples)  # Inverse proportion

# Train the model with class weights and ModelCheckpoint
history = model.fit(
    train_generator,
    epochs=epochs,
    validation_data=validation_generator,
    callbacks=[early_stopping, reduce_lr, model_checkpoint],
    class_weight=class_weights
)

# Evaluate the model
loss, accuracy = model.evaluate(test_generator)
print(f"Test Loss: {loss}")
print(f"Test Accuracy: {accuracy}")

# Confusion Matrix
y_probs = model.predict(test_generator)
y_pred = np.argmax(y_probs, axis=1)
y_true = test_generator.classes  # Directly from generator

class_names = list(train_generator.class_indices.keys()) # Get class names from generator

cm = confusion_matrix(y_true, y_pred)


plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=class_names, yticklabels=class_names)
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix")
plt.show()

# Load treatment data
with open("treatments.json", "r") as f:
    treatment_data = json.load(f)

# Prediction and advice function
def predict_and_advise(image_path, model, img_width, img_height, treatment_data, class_names):
    try:
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(img_width, img_height))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)

        predicted_class_name = class_names[predicted_class]

        print(f"Predicted class: {predicted_class_name}")

        if predicted_class_name in treatment_data:
            treatments = treatment_data[predicted_class_name]["treatments"]
            general_advice = treatment_data[predicted_class_name].get("general_advice", [])

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

    except Exception as e:
        print(f"Error in prediction and advice: {e}")

# Example usage (after training)
image_path = "path/to/your/test/image.jpg"  # Replace with your image path.
predict_and_advise(image_path, model, img_width, img_height, treatment_data, class_names)