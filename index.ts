export interface Tree {
  id: number;
  name: string;
  species: string;
  age: number;
  location: string;
  planted_date: string;
  orchard: number;
  created_at: string;
  updated_at: string;
}

export interface Orchard {
  id: number;
  name: string;
  location: string;
  size: number;
  owner: string;
  created_at: string;
  updated_at: string;
  trees: Tree[];
}

export interface ScannedImage {
  id: number;
  image: string;
  tree: number;
  uploaded_at: string;
  prediction_result?: string;
  confidence_score?: number;
}

export interface TreeHealth {
  id: number;
  tree: number;
  health_status: 'healthy' | 'disease_detected' | 'needs_attention';
  disease_type?: string;
  severity_level: 'low' | 'medium' | 'high';
  notes?: string;
  last_checked: string;
  created_at: string;
  updated_at: string;
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
  class_names: string[];
  image_url: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Advanced Features Types
export interface NDVIAnalysis {
  ndvi_statistics: {
    mean: number;
    std: number;
    min: number;
    max: number;
  };
  health_assessment: string;
  message: string;
}

export interface AnomalyDetection {
  anomaly_analysis: {
    total_records: number;
    healthy_count: number;
    diseased_count: number;
    disease_rate: number;
    anomalies_detected: number;
    anomalies: Array<{
      type: string;
      severity: string;
      description: string;
      value: number;
    }>;
  };
  period: string;
  orchard_id?: string;
}

export interface HealthTrends {
  trend_analysis: {
    period: string;
    total_records: number;
    trend_direction: string;
    trend_magnitude: number;
    monthly_trends: Array<{
      month: string;
      total_records: number;
      healthy: number;
      apple_scab: number;
      black_rot: number;
      cedar_apple_rust: number;
      stressed: number;
      disease_rate: number;
    }>;
  };
  orchard_id?: string;
}

export interface HealthReport {
  report_info: {
    generated_at: string;
    report_type: string;
    orchard: {
      id?: number;
      name: string;
      location: string;
    };
  };
  summary: {
    total_trees: number;
    total_health_records: number;
    total_images_analyzed: number;
    recent_activity: {
      health_records_last_30_days: number;
      images_analyzed_last_30_days: number;
    };
  };
  health_analysis: {
    health_distribution: Record<string, number>;
    disease_analysis: Record<string, any>;
    overall_health_score: number;
  };
  recommendations: Array<{
    priority: string;
    category: string;
    recommendation: string;
  }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  answer: string;
  agentic_action?: string;
}

export interface DashboardStats {
  stats: {
    total_analyses: number;
    accuracy_rate: number;
    active_alerts: number;
    processing_time: number;
  };
  recent_analyses: Array<{
    id: number;
    type: string;
    filename: string;
    result: string;
    confidence: number;
    timestamp: string;
  }>;
} 