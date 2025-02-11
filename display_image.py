import os
import cv2

cleaned_dataset_path = 'C:\Users\siddh\Projects\New folder/apple_disease_cleaned' # path to new directory
original_dataset_path = 'C:\Users\siddh\Downloads\kaggle-apple-disease-dataset\datasets\train' # path to old directory

# these are the valid paths for different classes of diseases
valid_classes = ["Apple Scab", "Apple Black Rot", "Apple Cedar Rust", "Apple Healthy"]

# this creates the new directory
os.makedirs(cleaned_dataset_path, exist_ok = True)

# goes through the image path and copies the new files to the new directory
for folder in valid_classes:
    new_folder_path = os.path.join(cleaned_dataset_path, folder)
    old_folder_path = os.path.join(original_dataset_path, folder)
    os.makedirs(new_folder_path, exist_ok = True)

    for image in os.listdir(old_folder_path):
        old_image_path = os.path.join(old_folder_path, image)
        new_image_path = os.path.join(new_folder_path, image)
        try:
            img = cv2.imread(old_image_path)
            if img is not None:
                cv2.imwrite(new_image_path, img)
        except:
            print("Image {} not copied".format(image))