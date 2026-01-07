import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Tree, Orchard, ScannedImage, TreeHealth, PredictionResult, LoginCredentials } from '../types';

const API_BASE_URL = (window as any).env?.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    const response: AxiosResponse = await this.api.post('/api/auth/login/', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/api/auth/logout/');
  }

  // Health Check
  async healthCheck(): Promise<any> {
    const response: AxiosResponse = await this.api.get('/api/health/');
    return response.data;
  }

  // Orchards
  async getOrchards(): Promise<Orchard[]> {
    const response: AxiosResponse = await this.api.get('/api/orchards/');
    return response.data;
  }

  async getOrchard(id: number): Promise<Orchard> {
    const response: AxiosResponse = await this.api.get(`/api/orchards/${id}/`);
    return response.data;
  }

  async createOrchard(orchard: Partial<Orchard>): Promise<Orchard> {
    const response: AxiosResponse = await this.api.post('/api/orchards/', orchard);
    return response.data;
  }

  async updateOrchard(id: number, orchard: Partial<Orchard>): Promise<Orchard> {
    const response: AxiosResponse = await this.api.put(`/api/orchards/${id}/`, orchard);
    return response.data;
  }

  async deleteOrchard(id: number): Promise<void> {
    await this.api.delete(`/api/orchards/${id}/`);
  }

  // Trees
  async getTrees(): Promise<Tree[]> {
    const response: AxiosResponse = await this.api.get('/api/trees/');
    return response.data;
  }

  async getTree(id: number): Promise<Tree> {
    const response: AxiosResponse = await this.api.get(`/api/trees/${id}/`);
    return response.data;
  }

  async createTree(tree: Partial<Tree>): Promise<Tree> {
    const response: AxiosResponse = await this.api.post('/api/trees/', tree);
    return response.data;
  }

  async updateTree(id: number, tree: Partial<Tree>): Promise<Tree> {
    const response: AxiosResponse = await this.api.put(`/api/trees/${id}/`, tree);
    return response.data;
  }

  async deleteTree(id: number): Promise<void> {
    await this.api.delete(`/api/trees/${id}/`);
  }

  // Scanned Images
  async getScannedImages(): Promise<ScannedImage[]> {
    const response: AxiosResponse = await this.api.get('/api/scanned-images/');
    return response.data;
  }

  async getScannedImage(id: number): Promise<ScannedImage> {
    const response: AxiosResponse = await this.api.get(`/api/scanned-images/${id}/`);
    return response.data;
  }

  async uploadImage(file: File, treeId: number): Promise<ScannedImage> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tree', treeId.toString());

    const response: AxiosResponse = await this.api.post('/api/scanned-images/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteScannedImage(id: number): Promise<void> {
    await this.api.delete(`/api/scanned-images/${id}/`);
  }

  // Tree Health
  async getTreeHealth(): Promise<TreeHealth[]> {
    const response: AxiosResponse = await this.api.get('/api/tree-health/');
    return response.data;
  }

  async getTreeHealthById(id: number): Promise<TreeHealth> {
    const response: AxiosResponse = await this.api.get(`/api/tree-health/${id}/`);
    return response.data;
  }

  async createTreeHealth(health: Partial<TreeHealth>): Promise<TreeHealth> {
    const response: AxiosResponse = await this.api.post('/api/tree-health/', health);
    return response.data;
  }

  async updateTreeHealth(id: number, health: Partial<TreeHealth>): Promise<TreeHealth> {
    const response: AxiosResponse = await this.api.put(`/api/tree-health/${id}/`, health);
    return response.data;
  }

  async deleteTreeHealth(id: number): Promise<void> {
    await this.api.delete(`/api/tree-health/${id}/`);
  }

  // ML Prediction
  async predictDisease(file: File): Promise<PredictionResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse = await this.api.post('/api/predict/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Bulk Operations
  async bulkUploadImages(files: File[], treeId: number): Promise<ScannedImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('tree', treeId.toString());

    const response: AxiosResponse = await this.api.post('/api/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async bulkCreateTrees(trees: Partial<Tree>[]): Promise<Tree[]> {
    const response: AxiosResponse = await this.api.post('/api/bulk-create-trees/', { trees });
    return response.data;
  }

  // Advanced Features - NDVI Analysis
  async analyzeNDVI(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse = await this.api.post('/api/ndvi-analysis/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Advanced Features - Anomaly Detection
  async detectAnomalies(orchardId?: number, daysBack: number = 30): Promise<any> {
    const params = new URLSearchParams();
    if (orchardId) params.append('orchard_id', orchardId.toString());
    params.append('days_back', daysBack.toString());

    const response: AxiosResponse = await this.api.get(`/api/anomaly-detection/?${params}`);
    return response.data;
  }

  // Advanced Features - Health Trends
  async getHealthTrends(orchardId?: number, monthsBack: number = 6): Promise<any> {
    const params = new URLSearchParams();
    if (orchardId) params.append('orchard_id', orchardId.toString());
    params.append('months_back', monthsBack.toString());

    const response: AxiosResponse = await this.api.get(`/api/health-trends/?${params}`);
    return response.data;
  }

  // Advanced Features - Report Generation
  async generateReport(orchardId?: number, reportType: string = 'comprehensive'): Promise<any> {
    const params = new URLSearchParams();
    if (orchardId) params.append('orchard_id', orchardId.toString());
    params.append('type', reportType);

    const response: AxiosResponse = await this.api.get(`/api/generate-report/?${params}`);
    return response.data;
  }

  // AI Chat/Agentic Assistant
  async chatWithAI(message: string, orchardId?: number, image?: File): Promise<any> {
    const formData = new FormData();
    formData.append('message', message);
    if (orchardId) formData.append('orchard_id', orchardId.toString());
    if (image) formData.append('image', image);

    const response: AxiosResponse = await this.api.post('/api/chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    const response: AxiosResponse = await this.api.get('/api/dashboard/');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 