import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Park as OrchardIcon,
  Image as ImageIcon,
  HealthAndSafety as HealthIcon,
} from '@mui/icons-material';
import apiService from '../services/api';

interface Orchard {
  id: number;
  name: string;
  location: string;
  size: number;
}

interface Tree {
  id: number;
  name: string;
  species: string;
  age: number;
}

interface ScannedImage {
  id: number;
  image_url: string;
  uploaded_at: string;
}

interface TreeHealth {
  id: number;
  tree: number;
  health_status: string;
  disease_type?: string;
}

interface DashboardStats {
  totalOrchards: number;
  totalTrees: number;
  totalImages: number;
  totalHealthRecords: number;
  recentOrchards: Orchard[];
  recentTrees: Tree[];
  recentImages: ScannedImage[];
  healthAlerts: TreeHealth[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const [dashboardStats, orchards, trees, healthRecords] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getOrchards(),
        apiService.getTrees(),
        apiService.getTreeHealth(),
      ]);

      // Transform API data to match our interface
      const transformedStats: DashboardStats = {
        totalOrchards: orchards.length,
        totalTrees: trees.length,
        totalImages: dashboardStats.stats?.total_analyses || 0,
        totalHealthRecords: healthRecords.length,
        recentOrchards: orchards.slice(0, 2).map(orchard => ({
          id: orchard.id,
          name: orchard.name,
          location: orchard.location,
          size: orchard.size || 0,
        })),
        recentTrees: trees.slice(0, 2).map(tree => ({
          id: tree.id,
          name: tree.name || `Tree ${tree.id}`,
          species: tree.species || 'Unknown',
          age: tree.age || 0,
        })),
        recentImages: dashboardStats.recent_analyses?.map((analysis: any) => ({
          id: analysis.id,
          image_url: analysis.filename,
          uploaded_at: analysis.timestamp,
        })) || [],
        healthAlerts: healthRecords
          .filter(record => record.health_status !== 'healthy')
          .slice(0, 5)
          .map(record => ({
            id: record.id,
            tree: record.tree,
            health_status: record.health_status,
            disease_type: record.disease_type,
          })),
      };
      
      setStats(transformedStats);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 3 } : {},
        transition: 'all 0.2s',
        height: '100%',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
          </Box>
          <Box color={color} fontSize="2rem">
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' } }}>
          <StatCard
            title="Total Orchards"
            value={stats.totalOrchards}
            icon={<OrchardIcon />}
            color="primary.main"
            onClick={() => navigate('/orchards')}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' } }}>
          <StatCard
            title="Total Trees"
            value={stats.totalTrees}
            icon={<OrchardIcon />}
            color="success.main"
            onClick={() => navigate('/trees')}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' } }}>
          <StatCard
            title="Scanned Images"
            value={stats.totalImages}
            icon={<ImageIcon />}
            color="info.main"
            onClick={() => navigate('/images')}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' } }}>
          <StatCard
            title="Health Records"
            value={stats.totalHealthRecords}
            icon={<HealthIcon />}
            color="warning.main"
            onClick={() => navigate('/health')}
          />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/orchards/new')}
          >
            Add Orchard
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate('/trees/new')}
          >
            Add Tree
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate('/predict')}
          >
            Predict Disease
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate('/health/new')}
          >
            Add Health Record
          </Button>
        </Box>
      </Paper>

      {/* Health Alerts */}
      {stats.healthAlerts.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom color="warning.main">
            Health Alerts ({stats.healthAlerts.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {stats.healthAlerts.map((alert) => (
              <Alert key={alert.id} severity="warning">
                Tree #{alert.tree} - {alert.health_status} - {alert.disease_type || 'Unknown disease'}
              </Alert>
            ))}
          </Box>
        </Paper>
      )}

      {/* Recent Activity */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orchards
            </Typography>
            {stats.recentOrchards.map((orchard) => (
              <Box key={orchard.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1">{orchard.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {orchard.location} • {orchard.size} acres
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trees
            </Typography>
            {stats.recentTrees.map((tree) => (
              <Box key={tree.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography variant="subtitle1">{tree.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {tree.species} • Age: {tree.age} years
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 