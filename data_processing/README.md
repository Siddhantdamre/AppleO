# Data Processing Scripts

This folder contains scripts for processing and preparing the apple disease dataset.

## Files

- **data_clean.py**: Cleans and copies valid images from the original dataset to a cleaned directory
- **data_preprocessing.py**: Preprocesses images by resizing and normalizing them, saves as .npy files
- **data_split.py**: Splits the cleaned dataset into training, validation, and test sets (70/15/15)
- **prep_single.py**: Preprocesses a single image for testing purposes

## Workflow

1. Run `data_clean.py` to clean the raw dataset
2. Run `data_split.py` to split data into train/val/test sets
3. Run `data_preprocessing.py` to preprocess all images
4. Use `prep_single.py` for individual image preprocessing
