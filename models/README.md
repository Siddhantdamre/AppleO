# Model Building Scripts

This folder contains scripts for building and training machine learning models for apple disease classification.

## Files

- **data_loader.py**: Loads preprocessed image data from .npy files and builds a CNN model with Sequential API
- **model_building.py**: Similar to data_loader.py, builds and trains a CNN model for apple disease classification
- **new_model.py**: Advanced model using ResNet50 transfer learning with data augmentation, callbacks, and confusion matrix visualization

## Models

All models classify apple diseases into 4 categories:
- Apple Scab
- Black Rot
- Cedar Apple Rust
- Healthy

## Usage

Choose the appropriate model script based on your needs:
- Use `model_building.py` or `data_loader.py` for simple CNN models
- Use `new_model.py` for better accuracy with transfer learning and advanced features
