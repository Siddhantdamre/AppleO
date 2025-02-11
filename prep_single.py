import cv2
import numpy as np
import os

def preprocess_single_image(image_path, target_size=(224, 224), save_dir=None):
    """
    Loads, resizes, and normalizes a single image.
    Args:
        image_path: Path to the image file.
        target_size: The desired size of the image (width, height).
        save_dir: (Optional) Directory to save the preprocessed image as a .npy file.
    Returns:
        A NumPy array representing the preprocessed image, or None if there was an error.
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not load image at {image_path}")
            return None

        image = cv2.resize(image, target_size)
        image = image.astype('float32') / 255.0  # Normalize to [0, 1]
        
        if save_dir:
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, os.path.splitext(os.path.basename(image_path))[0] + '.npy')
            np.save(save_path, image)
            print(f"Preprocessed image saved at: {save_path}")
        
        return image
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None

# Example usage
image_path = r'C:\Users\siddh\Projects\New folder\apple_disease_split\train\apple_scab\0a5e9323-dbad-432d-ac58-d291718345d9___FREC_Scab 3417_90deg.jpg'  # Replace with actual path
save_directory = r'C:\Users\siddh\Projects\New folder\preprocessed_data\train\apple_scab'  # Replace with actual path
preprocessed_image = preprocess_single_image(image_path, save_dir=save_directory)

if preprocessed_image is not None:
    print("Image preprocessing successful.")
