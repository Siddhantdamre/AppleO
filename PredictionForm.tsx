import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import apiService from '../services/api';
import { PredictionResult } from '../types';

const PredictionForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError('');
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await apiService.predictDisease(selectedFile);
      setPrediction(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseColor = (disease: string) => {
    switch (disease.toLowerCase()) {
      case 'healthy':
        return 'success';
      case 'apple_scab':
        return 'error';
      case 'black_rot':
        return 'error';
      case 'cedar_apple_rust':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDiseaseName = (disease: string) => {
    switch (disease.toLowerCase()) {
      case 'healthy':
        return 'Healthy';
      case 'apple_scab':
        return 'Apple Scab';
      case 'black_rot':
        return 'Black Rot';
      case 'cedar_apple_rust':
        return 'Cedar Apple Rust';
      default:
        return disease;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Disease Prediction
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Upload an image of an apple tree leaf to predict potential diseases using our AI model.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              size="large"
              sx={{ mb: 2 }}
            >
              Select Image
            </Button>
          </label>

          {previewUrl && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Card sx={{ maxWidth: 400 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={previewUrl}
                  alt="Preview"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {selectedFile?.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handlePredict}
            disabled={!selectedFile || loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Predict Disease'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analyzing Image...
          </Typography>
          <LinearProgress />
        </Paper>
      )}

      {prediction && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Prediction Results
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { md: '1 1 50%' } }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={prediction.image_url}
                  alt="Analyzed"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Box>
            <Box sx={{ flex: { md: '1 1 50%' } }}>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
              <Chip
                label={getDiseaseName(prediction.prediction)}
                color={getDiseaseColor(prediction.prediction) as any}
                size="medium"
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" gutterBottom>
                Confidence Score
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={prediction.confidence * 100}
                  sx={{ height: 20, borderRadius: 10 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {Math.round(prediction.confidence * 100)}% confidence
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                All Possible Classes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {prediction.class_names.map((className) => (
                  <Chip
                    key={className}
                    label={getDiseaseName(className)}
                    variant={className === prediction.prediction ? 'filled' : 'outlined'}
                    color={getDiseaseColor(className) as any}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {prediction.prediction.toLowerCase() === 'healthy' ? (
              <Alert severity="success">
                The leaf appears to be healthy. Continue with regular monitoring and maintenance.
              </Alert>
            ) : (
              <Alert severity="warning">
                Disease detected: {getDiseaseName(prediction.prediction)}. Consider consulting with a plant pathologist and implementing appropriate treatment measures.
              </Alert>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PredictionForm; 