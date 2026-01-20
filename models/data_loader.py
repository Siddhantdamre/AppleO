import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Define data directories
base_dir = r'C:\Users\siddh\Projects\New folder\preprocessed_data'
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')
test_dir = os.path.join(base_dir, 'test')

# Define image parameters
img_width, img_height = 224, 224
num_classes = 4  # apple_scab, black_rot, cedar_apple_rust, healthy
batch_size = 32
epochs = 10

def load_data(data_dir, img_width, img_height, batch_size):
    """
    Loads the preprocessed image data from .npy files.
    Args:
        data_dir: Path to the directory containing the image data.
        img_width: Width of the images.
        img_height: Height of the images.
        batch_size: The batch size for training.
    Returns:
        A tf.data.Dataset object containing the images and labels.
    """
    image_paths = []
    labels = []
    class_names = os.listdir(data_dir)
    num_classes = len(class_names)

    for class_index, class_name in enumerate(class_names):
        class_path = os.path.join(data_dir, class_name)
        if not os.path.isdir(class_path):
            continue
        for image_name in os.listdir(class_path):
            image_path = os.path.join(class_path, image_name)
            image_paths.append(image_path)
            labels.append(class_index)

    def load_and_preprocess(image_path, label):
        """Loads and preprocesses a single image."""
        image = np.load(image_path)  # Load the .npy file
        return image, label

    # Create a tf.data.Dataset from the image paths and labels
    dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))

    # Shuffle the dataset
    dataset = dataset.shuffle(len(image_paths))

    # Map the load_and_preprocess function to the dataset
    dataset = dataset.map(lambda image_path, label: tf.numpy_function(
        load_and_preprocess,
        [image_path, label],
        [tf.float32, tf.int32] #float32 for image, int32 for labels
    ), num_parallel_calls=tf.data.AUTOTUNE)

    # Batch the dataset
    dataset = dataset.batch(batch_size)

    # Prefetch the data for better performance
    dataset = dataset.prefetch(tf.data.AUTOTUNE)

    return dataset

# Load the training, validation, and test data
train_data = load_data(train_dir, img_width, img_height, batch_size)
validation_data = load_data(val_dir, img_width, img_height, batch_size)
test_data = load_data(test_dir, img_width, img_height, batch_size)

# Build the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(img_width, img_height, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')  # Output layer with softmax
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='sparse_categorical_crossentropy',  # Use sparse_categorical_crossentropy
              metrics=['accuracy'])

# Print the model summary
model.summary()

# Train the model
history = model.fit(
    train_data,
    # steps_per_epoch=len(os.listdir(train_dir)) // batch_size,
    epochs=epochs,
    validation_data=validation_data,
    # validation_steps=len(os.listdir(val_dir)) // batch_size
)

# Evaluate the model on the test set
loss, accuracy = model.evaluate(test_data)
print(f"Test Loss: {loss}")
print(f"Test Accuracy: {accuracy}")

# Save the model
model.save('apple_disease_model.keras')  # Saves the model in .keras format