import numpy as np

file_path = r"C:\Users\siddh\Projects\New folder\preprocessed_data\train\apple_scab\0a769a71-052a-4f19-a4d8-b0f0cb75541c___FREC_Scab 3165.npy"  # Replace with a real path
try:
    data = np.load(file_path, allow_pickle=True)  # Force pickle loading for inspection
    print(type(data))  # What type is the data?
    print(data.shape)  # What is the shape of the data?
    print(data.dtype)  # What is the data type?
    if isinstance(data, np.ndarray) and data.dtype != np.dtype('O'): # Check if it's a standard numpy array and not object type
        print("This is a standard NumPy array.")
    else:
        print("This is NOT a standard NumPy array. It is likely pickled or an object array.")
        print(data) # Print the data to see what it contains.
except Exception as e:
    print(f"Error loading file: {e}")