import os
import shutil
import random

# Define the paths (USE RAW STRINGS)
cleaned_dataset_path = r'C:\Users\siddh\Projects\New folder\apple_disease_cleaned'
base_split_dir = r'C:\Users\siddh\Projects\New folder\apple_disease_split'
train_dir = os.path.join(base_split_dir, 'train')
val_dir = os.path.join(base_split_dir, 'val')
test_dir = os.path.join(base_split_dir, 'test')

split_ratio = (0.7, 0.15, 0.15)  # train, val, test

print("cleaned_dataset_path:", cleaned_dataset_path)
print("train_dir:", train_dir)
print("val_dir:", val_dir)
print("test_dir:", test_dir)

# Create the base directory and subdirectories (train, val, test)
os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)


def divide_dataset(cleaned_dataset_path, train_dir, val_dir, test_dir, split_ratio):
    """Divides the dataset into training, validation, and test sets."""

    for folder in os.listdir(cleaned_dataset_path):
        folder_path = os.path.join(cleaned_dataset_path, folder)
        if not os.path.isdir(folder_path): #skips the directory if it is not valid
            print(f"Skipping non-directory: {folder_path}")
            continue # moves onto the next folder

        # Create subdirectories for each class in the train, val, and test directories
        train_class_dir = os.path.join(train_dir, folder)
        val_class_dir = os.path.join(val_dir, folder)
        test_class_dir = os.path.join(test_dir, folder)
        os.makedirs(train_class_dir, exist_ok=True)
        os.makedirs(val_class_dir, exist_ok=True)
        os.makedirs(test_class_dir, exist_ok=True)

        # Get the list of image files in the folder and shuffle it
        image_files = os.listdir(folder_path)
        random.shuffle(image_files)

        # Calculate the split indices
        train_count = int(len(image_files) * split_ratio[0])
        val_count = int(len(image_files) * (split_ratio[0] + split_ratio[1])) # the total number of train and test data

        # Split the images into train, val, and test sets
        train_images = image_files[:train_count]
        val_images = image_files[train_count:val_count]
        test_images = image_files[val_count:]

        # Copy images to the respective directories
        for image in train_images:
            src_path = os.path.join(folder_path, image)
            dst_path = os.path.join(train_class_dir, image)
            shutil.move(src_path, dst_path)

        for image in val_images:
            src_path = os.path.join(folder_path, image)
            dst_path = os.path.join(val_class_dir, image)
            shutil.move(src_path, dst_path)

        for image in test_images:
            src_path = os.path.join(folder_path, image)
            dst_path = os.path.join(test_class_dir, image)
            shutil.move(src_path, dst_path)


# Call the function to divide the dataset
divide_dataset(cleaned_dataset_path, train_dir, val_dir, test_dir, split_ratio)

print("Finished splitting the dataset.") #Debugging code