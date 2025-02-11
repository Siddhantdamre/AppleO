import cv2

image_path = r'C:\Users\siddh\Projects\New folder\preprocessed_data\train\apple_scab\0a5e9323-dbad-432d-ac58-d291718345d9___FREC_Scab 3417_90deg.jpg'  # Replace with the actual path
image = cv2.imread(image_path)

if image is None:
    print("Error: Could not load image")
else:
    print("Image shape:", image.shape)
    print("Pixel value (example):", image[0, 0, :])  # Check a pixel's BGR values