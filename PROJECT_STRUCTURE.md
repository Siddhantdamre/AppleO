# Project Structure Documentation

## Overview

This document explains the organization of the AppleO repository, which contains Python machine learning scripts for apple disease detection and a Next.js frontend application.

## Directory Structure

```
AppleO/
├── data_processing/          # Data cleaning and preprocessing scripts
│   ├── README.md
│   ├── data_clean.py         # Clean raw dataset
│   ├── data_preprocessing.py # Preprocess images (resize, normalize)
│   ├── data_split.py         # Split into train/val/test sets
│   └── prep_single.py        # Preprocess single image
│
├── models/                   # Model building and training
│   ├── README.md
│   ├── data_loader.py        # Load data and build CNN model
│   ├── model_building.py     # Build and train CNN model
│   └── new_model.py          # Advanced ResNet50 transfer learning
│
├── prediction/               # Inference and prediction
│   ├── README.md
│   ├── model_single.py       # Test single .npy file prediction
│   └── prediction_model.py   # Predict disease + treatment advice
│
├── utils/                    # Utility and helper scripts
│   ├── README.md
│   ├── countafimages.py      # Count images after split
│   ├── countogimages.py      # Count images in cleaned dataset
│   ├── delete_prepro.py      # Delete preprocessed data (caution!)
│   ├── display_image.py      # Display image info
│   ├── prepcheck.py          # Check preprocessed files
│   ├── tsting.py             # Test .npy file loading
│   └── x.py                  # Count images (duplicate)
│
├── treatments.JSON           # Treatment recommendations data
├── image.jpg                 # Sample image
├── commands.txt              # Common command examples
├── README.md                 # Main project documentation
├── PROJECT_STRUCTURE.md      # This file
│
└── [Next.js Config Files]    # Frontend configuration
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── eslint.config.mjs
    ├── postcss.config.mjs
    └── components.json
```

## File Categories

### 🔵 Data Processing (4 files)
Scripts that handle data cleaning, splitting, and preprocessing operations.

**Purpose**: Transform raw apple disease images into a format suitable for machine learning.

**Workflow**:
1. `data_clean.py` - Clean and validate raw images
2. `data_split.py` - Split into train/val/test (70/15/15)
3. `data_preprocessing.py` - Normalize and save as .npy
4. `prep_single.py` - For testing individual images

### 🟢 Models (3 files)
Scripts for building, training, and evaluating machine learning models.

**Purpose**: Create and train CNN models to classify apple diseases.

**Models Available**:
- Basic CNN (`model_building.py`, `data_loader.py`)
- Advanced ResNet50 Transfer Learning (`new_model.py`)

**Output**: Trained model files (`.keras` format)

### 🟡 Prediction (2 files)
Scripts for making predictions on new images using trained models.

**Purpose**: Use trained models to predict disease and provide treatment recommendations.

**Features**:
- Disease classification
- Treatment recommendations from `treatments.JSON`
- Support for both raw and preprocessed images

### 🟣 Utils (7 files)
Utility scripts for dataset inspection, validation, and maintenance.

**Purpose**: Helper functions for dataset management and debugging.

**Common Uses**:
- Count images in datasets
- Validate preprocessed files
- Inspect image properties
- Clean up data directories

## Disease Categories

The models classify apple leaf images into 4 categories:

1. **Apple Scab** - Fungal disease causing dark spots
2. **Black Rot** - Fungal disease with rotted areas
3. **Cedar Apple Rust** - Orange-yellow spots on leaves
4. **Healthy** - No visible disease symptoms

## Usage Examples

### Complete ML Pipeline

```bash
# 1. Clean the dataset
python data_processing/data_clean.py

# 2. Split into train/val/test
python data_processing/data_split.py

# 3. Preprocess images
python data_processing/data_preprocessing.py

# 4. Train model
python models/new_model.py

# 5. Make predictions
python prediction/prediction_model.py
```

### Frontend Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Key Design Decisions

### Why This Organization?

1. **Logical Grouping**: Files are grouped by their function in the ML pipeline
2. **Easy Navigation**: Clear folder names make it obvious where to find specific functionality
3. **Scalability**: Easy to add new scripts to appropriate categories
4. **Documentation**: Each folder has a README explaining its contents

### File Naming Conventions

- **data_*.py**: Data-related operations
- **model_*.py**: Model-related operations
- **prep_*.py**: Preprocessing operations
- **count*.py**: Counting/statistics utilities

## Notes

- All Python scripts contain hardcoded Windows paths - these need to be updated for your environment
- The Next.js frontend structure is minimal and can be expanded
- Treatment recommendations are stored in `treatments.JSON`
- Models are saved in `.keras` format (TensorFlow/Keras)

## Contributing

When adding new files:
1. Determine the appropriate category
2. Place in the correct folder
3. Update the folder's README.md
4. Follow existing naming conventions
5. Add usage examples in comments
