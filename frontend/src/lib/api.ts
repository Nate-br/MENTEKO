import axios, { type AxiosInstance, AxiosError } from 'axios';
import type { Scenario, Attempt, Assessment, ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'Request failed',
      status: error.response?.status,
    };
  }
  return { message: 'An unexpected error occurred' };
}

export const api = {
  health: async (): Promise<{ status: string }> => {
    try {
      const { data } = await client.get('/health');
      return data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  getScenarios: async (params?: { category?: string; difficulty?: string }): Promise<Scenario[]> => {
    try {
      const { data } = await client.get('/scenarios', { params });
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  getScenario: async (id: string): Promise<Scenario> => {
    try {
      const { data } = await client.get(`/scenarios/${id}`);
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  submitAttempt: async (payload: {
    scenario: string;
    selectedOption: string;
  }): Promise<Attempt> => {
    try {
      const { data } = await client.post('/attempts', payload);
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  getAttempts: async (): Promise<Attempt[]> => {
    try {
      const { data } = await client.get('/attempts');
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  createAssessment: async (payload: {
    attempts: string[];
  }): Promise<Assessment> => {
    try {
      const { data } = await client.post('/assessments', payload);
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  getAssessment: async (id: string): Promise<Assessment> => {
    try {
      const { data } = await client.get(`/assessments/${id}`);
      return data.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};

export default api;
