import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam

# ***CORRECT PATH TO THE PARENT OF PREPROCESSED DATA FOLDERS***
base_dir = r'C:\Users\siddh\Projects\New folder\preprocessed_data'  # <--- IMPORTANT: Verify this path!
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')
test_dir = os.path.join(base_dir, 'test')

# Define image parameters
img_width, img_height = 224, 224
num_classes = 4  # apple_scab, black_rot, cedar_apple_rust, healthy
batch_size = 32  # You can adjust this if you have memory issues
epochs = 10

def load_data(data_dir, img_width, img_height): # Removed batch_size here
    images = []
    labels = []
    class_names = os.listdir(data_dir)

    for class_index, class_name in enumerate(class_names):
        class_path = os.path.join(data_dir, class_name)
        if not os.path.isdir(class_path):
            continue
        for image_name in os.listdir(class_path):
            image_path = os.path.join(class_path, image_name)
            try:
                image = np.load(image_path)  # Load directly using NumPy
                images.append(image)
                labels.append(class_index)
            except Exception as e:
                print(f"Error loading image {image_path}: {e}")

    images = np.array(images)
    labels = np.array(labels)

    dataset = tf.data.Dataset.from_tensor_slices((images, labels))
    dataset = dataset.shuffle(len(images))
    dataset = dataset.batch(batch_size) # Batching added here
    dataset = dataset.prefetch(tf.data.AUTOTUNE)
    return dataset

# Load the data (batch size is handled within load_data now)
train_data = load_data(train_dir, img_width, img_height)
validation_data = load_data(val_dir, img_width, img_height)
test_data = load_data(test_dir, img_width, img_height)

# ... (rest of the model building, compilation, training, and evaluation code remains the same)

# Build the CNN model
model = Sequential([
    Input(shape=(img_width, img_height, 3)),
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Print the model summary
model.summary()

# Train the model
history = model.fit(
    train_data,
    epochs=epochs,
    validation_data=validation_data,
)

# Evaluate the model
loss, accuracy = model.evaluate(test_data)
print(f"Test Loss: {loss}")
print(f"Test Accuracy: {accuracy}")

# Save the model
model.save('apple_disease_model.keras')