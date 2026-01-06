# AppleO - Apple Disease Detection System

This project combines machine learning for apple disease detection with a Next.js frontend interface.

## Project Structure

The repository is organized into the following directories:

### 📂 **data_processing/**
Scripts for cleaning, splitting, and preprocessing the apple disease dataset.
- Dataset cleaning and validation
- Train/validation/test split (70/15/15)
- Image preprocessing and normalization

### 📂 **models/**
Machine learning model building and training scripts.
- CNN models for disease classification
- Transfer learning with ResNet50
- Model evaluation and metrics

### 📂 **prediction/**
Scripts for making predictions on new images using trained models.
- Disease prediction with treatment recommendations
- Single image testing and inference

### 📂 **utils/**
Utility scripts for dataset management and testing.
- Image counting and statistics
- File validation and inspection
- Data cleanup operations

### 📄 **Root Files**
- `treatments.JSON` - Treatment recommendations for each disease type
- `image.jpg` - Sample image
- `commands.txt` - Common command examples
- Next.js configuration files

## Apple Disease Classification

The ML models classify apple leaf diseases into 4 categories:
1. **Apple Scab**
2. **Black Rot**
3. **Cedar Apple Rust**
4. **Healthy**

## Machine Learning Workflow

1. **Data Processing**: Clean and preprocess images (`data_processing/`)
2. **Model Training**: Train classification models (`models/`)
3. **Prediction**: Use trained models for inference (`prediction/`)

## Frontend (Next.js)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
