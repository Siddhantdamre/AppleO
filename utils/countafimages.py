import os

base_split_dir = r'C:\Users\siddh\Projects\New folder\apple_disease_split'  # Replace with your path

print("base_split_dir:", base_split_dir) #Debugging

for split_name in ['train', 'val', 'test']:
    split_dir = os.path.join(base_split_dir, split_name)
    print(f"--- {split_name.upper()} DIRECTORY ---")

    if os.path.exists(split_dir): #Checking to see if the path exists
        for class_name in os.listdir(split_dir):
            class_dir = os.path.join(split_dir, class_name)
            if os.path.isdir(class_dir):  # Make sure it's a directory
                num_images = len(os.listdir(class_dir))
                print(f"  {class_name}: {num_images} images")
            else:
                print(f"  {class_name} is not a directory") #Debugging
    else:
        print(f"  {split_dir} does not exist") #Debugging