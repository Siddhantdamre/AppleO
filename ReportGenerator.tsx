import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import apiService from '../services/api';
import { HealthReport } from '../types';

interface ReportGeneratorProps {
  orchardId?: number;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ orchardId }) => {
  const [reportType, setReportType] = useState('comprehensive');
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.generateReport(orchardId, reportType);
      setReport(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const reportText = `
ORCHARD HEALTH REPORT
Generated: ${new Date(report.report_info.generated_at).toLocaleString()}
Orchard: ${report.report_info.orchard.name}
Location: ${report.report_info.orchard.location}
Report Type: ${report.report_info.report_type}

SUMMARY
Total Trees: ${report.summary.total_trees}
Total Health Records: ${report.summary.total_health_records}
Total Images Analyzed: ${report.summary.total_images_analyzed}
Recent Activity (30 days):
- Health Records: ${report.summary.recent_activity.health_records_last_30_days}
- Images Analyzed: ${report.summary.recent_activity.images_analyzed_last_30_days}

HEALTH ANALYSIS
Overall Health Score: ${report.health_analysis.overall_health_score}%

Health Distribution:
${Object.entries(report.health_analysis.health_distribution)
  .map(([status, count]) => `- ${status}: ${count}`)
  .join('\n')}

Disease Analysis:
${Object.entries(report.health_analysis.disease_analysis)
  .map(([disease, data]) => `- ${disease}: ${data.count} cases, ${(data.avg_confidence * 100).toFixed(1)}% avg confidence`)
  .join('\n')}

RECOMMENDATIONS
${report.recommendations
  .map((rec, index) => `${index + 1}. [${rec.priority.toUpperCase()}] ${rec.recommendation}`)
  .join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orchard-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <WarningIcon />;
      case 'medium':
        return <InfoIcon />;
      case 'low':
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Health Report Generator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Generate comprehensive health reports for your orchard with detailed analysis and recommendations.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="comprehensive">Comprehensive Report</MenuItem>
              <MenuItem value="summary">Summary Report</MenuItem>
              <MenuItem value="trends">Trends Report</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <ReportIcon />}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>

          {report && (
            <Button
              variant="outlined"
              onClick={handleDownloadReport}
              startIcon={<DownloadIcon />}
            >
              Download Report
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {report && (
        <Grid container spacing={3}>
          {/* Report Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Generated: {new Date(report.report_info.generated_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Type: {report.report_info.report_type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Orchard: {report.report_info.orchard.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {report.report_info.orchard.location}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Total Trees"
                      secondary={report.summary.total_trees}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Health Records"
                      secondary={report.summary.total_health_records}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Images Analyzed"
                      secondary={report.summary.total_images_analyzed}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Recent Activity (30 days)"
                      secondary={`${report.summary.recent_activity.health_records_last_30_days} records, ${report.summary.recent_activity.images_analyzed_last_30_days} images`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Score */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Health Score
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="primary">
                    {report.health_analysis.overall_health_score}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {report.health_analysis.overall_health_score >= 80 ? 'Excellent' :
                     report.health_analysis.overall_health_score >= 60 ? 'Good' :
                     report.health_analysis.overall_health_score >= 40 ? 'Fair' : 'Poor'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(report.health_analysis.health_distribution).map(([status, count]) => (
                    <Chip
                      key={status}
                      label={`${status}: ${count}`}
                      color={status === 'healthy' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Disease Analysis */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Disease Analysis
                </Typography>
                {Object.entries(report.health_analysis.disease_analysis).map(([disease, data]) => (
                  <Box key={disease} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {disease.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Cases: {data.count} | Trees Affected: {data.trees_affected} | 
                      Avg Confidence: {(data.avg_confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <List>
                  {report.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getPriorityIcon(recommendation.priority)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={recommendation.priority.toUpperCase()}
                              color={getPriorityColor(recommendation.priority) as any}
                              size="small"
                            />
                            <Typography variant="body1">
                              {recommendation.recommendation}
                            </Typography>
                          </Box>
                        }
                        secondary={`Category: ${recommendation.category}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ReportGenerator; 