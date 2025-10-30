# Prediction Scripts

This folder contains scripts for making predictions on new images using trained models.

## Files

- **prediction_model.py**: Loads a trained model and predicts disease from an image, provides treatment suggestions from treatments.json
- **model_single.py**: Tests prediction on a single preprocessed .npy image file

## Usage

1. Train a model using scripts from the `models` folder
2. Use `prediction_model.py` to predict disease and get treatment recommendations for new images
3. Use `model_single.py` to test with preprocessed .npy files

## Requirements

- Trained model file (e.g., `apple_disease_model.keras`)
- Treatment data file (`treatments.JSON` in root directory)
