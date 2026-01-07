import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  Grass as GrassIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import apiService from '../services/api';
import { NDVIAnalysis, AnomalyDetection, HealthTrends } from '../types';

interface AdvancedAnalyticsProps {
  orchardId?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ orchardId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ndviResult, setNdviResult] = useState<NDVIAnalysis | null>(null);
  const [anomalyResult, setAnomalyResult] = useState<AnomalyDetection | null>(null);
  const [trendsResult, setTrendsResult] = useState<HealthTrends | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(30);
  const [monthsBack, setMonthsBack] = useState(6);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleNDVIAnalysis = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.analyzeNDVI(selectedImage);
      setNdviResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'NDVI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnomalyDetection = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.detectAnomalies(orchardId, daysBack);
      setAnomalyResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Anomaly detection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleHealthTrends = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getHealthTrends(orchardId, monthsBack);
      setTrendsResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Health trends analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return '#4caf50';
      case 'stressed':
        return '#ff9800';
      case 'unhealthy':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getAnomalyColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="NDVI Analysis" icon={<GrassIcon />} />
            <Tab label="Anomaly Detection" icon={<WarningIcon />} />
            <Tab label="Health Trends" icon={<TrendingIcon />} />
          </Tabs>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          NDVI (Normalized Difference Vegetation Index) Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Upload an image to analyze vegetation health using NDVI calculations.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="ndvi-image-upload"
            type="file"
            onChange={handleImageSelect}
          />
          <label htmlFor="ndvi-image-upload">
            <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
              Select Image
            </Button>
          </label>
          {selectedImage && (
            <Chip
              label={selectedImage.name}
              onDelete={() => setSelectedImage(null)}
              sx={{ ml: 2 }}
            />
          )}
          <Button
            variant="contained"
            onClick={handleNDVIAnalysis}
            disabled={!selectedImage || loading}
            sx={{ ml: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Analyze NDVI'}
          </Button>
        </Box>

        {ndviResult && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    NDVI Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Mean NDVI: {ndviResult.ndvi_statistics.mean.toFixed(3)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(ndviResult.ndvi_statistics.mean * 100, 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    Standard Deviation: {ndviResult.ndvi_statistics.std.toFixed(3)}
                  </Typography>
                  <Typography variant="body2">
                    Range: {ndviResult.ndvi_statistics.min.toFixed(3)} - {ndviResult.ndvi_statistics.max.toFixed(3)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Health Assessment
                  </Typography>
                  <Chip
                    label={ndviResult.health_assessment}
                    color={ndviResult.health_assessment === 'healthy' ? 'success' : 'warning'}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {ndviResult.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Anomaly Detection
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Detect unusual patterns in your orchard health data.
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Days Back</InputLabel>
            <Select
              value={daysBack}
              label="Days Back"
              onChange={(e) => setDaysBack(Number(e.target.value))}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAnomalyDetection}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Detect Anomalies'}
          </Button>
        </Box>

        {anomalyResult && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Analysis Summary
                  </Typography>
                  <Typography variant="body2">
                    Total Records: {anomalyResult.anomaly_analysis.total_records}
                  </Typography>
                  <Typography variant="body2">
                    Healthy: {anomalyResult.anomaly_analysis.healthy_count}
                  </Typography>
                  <Typography variant="body2">
                    Diseased: {anomalyResult.anomaly_analysis.diseased_count}
                  </Typography>
                  <Typography variant="body2">
                    Disease Rate: {(anomalyResult.anomaly_analysis.disease_rate * 100).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Anomalies Detected: {anomalyResult.anomaly_analysis.anomalies_detected}
                  </Typography>
                  {anomalyResult.anomaly_analysis.anomalies.map((anomaly, index) => (
                    <Alert
                      key={index}
                      severity={anomaly.severity === 'high' ? 'error' : 'warning'}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">
                        {anomaly.description}
                      </Typography>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Health Trends Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Track health trends over time to identify patterns and improvements.
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Months Back</InputLabel>
            <Select
              value={monthsBack}
              label="Months Back"
              onChange={(e) => setMonthsBack(Number(e.target.value))}
            >
              <MenuItem value={3}>3 months</MenuItem>
              <MenuItem value={6}>6 months</MenuItem>
              <MenuItem value={12}>12 months</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleHealthTrends}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Analyze Trends'}
          </Button>
        </Box>

        {trendsResult && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trend Summary
                  </Typography>
                  <Typography variant="body2">
                    Period: {trendsResult.trend_analysis.period}
                  </Typography>
                  <Typography variant="body2">
                    Total Records: {trendsResult.trend_analysis.total_records}
                  </Typography>
                  <Typography variant="body2">
                    Trend Direction: {trendsResult.trend_analysis.trend_direction}
                  </Typography>
                  <Typography variant="body2">
                    Trend Magnitude: {(trendsResult.trend_analysis.trend_magnitude * 100).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendsResult.trend_analysis.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="disease_rate" stroke="#f44336" name="Disease Rate" />
                      <Line type="monotone" dataKey="healthy" stroke="#4caf50" name="Healthy" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
};

export default AdvancedAnalytics; 