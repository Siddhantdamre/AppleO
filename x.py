import os

cleaned_dataset_path = r'C:\Users\siddh\Projects\New folder\apple_disease_cleaned'  # Replace with your path

print(f"--- CLEANED DIRECTORY ---")

for class_name in os.listdir(cleaned_dataset_path):
    class_dir = os.path.join(cleaned_dataset_path, class_name)
    if os.path.isdir(class_dir):  # Make sure it's a directory
        num_images = len(os.listdir(class_dir))
        print(f"  {class_name}: {num_images} images")