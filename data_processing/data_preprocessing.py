import os
import cv2
import numpy as np

def preprocess_image(image_path, target_size=(224, 224)):
    try:
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not load image at {image_path}")
            return None

        image = cv2.resize(image, target_size)
        image = image.astype('float32') / 255.0  # Normalize to [0, 1]
        return image
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None

base_dir = r'C:\Users\siddh\Projects\New folder\apple_disease_split'  # ***CORRECT PATH TO ORIGINAL IMAGES***
train_dir = os.path.join(base_dir, 'train')
val_dir = os.path.join(base_dir, 'val')
test_dir = os.path.join(base_dir, 'test')

def preprocess_and_save(data_dir, save_dir, target_size=(224, 224)):
    os.makedirs(save_dir, exist_ok=True)

    for class_name in os.listdir(data_dir):
        class_path = os.path.join(data_dir, class_name)
        if not os.path.isdir(class_path):
            print(f"Skipping non-directory: {class_path}")
            continue

        save_class_dir = os.path.join(save_dir, class_name)
        os.makedirs(save_class_dir, exist_ok=True)

        for image_name in os.listdir(class_path):
            image_path = os.path.join(class_path, image_name)
            processed_image = preprocess_image(image_path, target_size)

            if processed_image is not None:
                save_image_path = os.path.join(save_class_dir, os.path.splitext(image_name)[0] + '.npy')
                np.save(save_image_path, processed_image)
            else:
                print(f"Warning: Image {image_path} could not be preprocessed. Skipping.")

# ***CORRECT PATHS TO SAVE PREPROCESSED DATA***
preprocessed_base_dir = r'C:\Users\siddh\Projects\New folder\preprocessed_data' # Parent folder of train, val, test
preprocessed_train_dir = os.path.join(preprocessed_base_dir, 'train')
preprocessed_val_dir = os.path.join(preprocessed_base_dir, 'val')
preprocessed_test_dir = os.path.join(preprocessed_base_dir, 'test')

preprocess_and_save(train_dir, preprocessed_train_dir)
preprocess_and_save(val_dir, preprocessed_val_dir)
preprocess_and_save(test_dir, preprocessed_test_dir)

print("Finished preprocessing")