export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

type ApiErrorShape = { detail?: string };

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError('Network error', 0);
  }

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const body = isJson ? ((await res.json()) as unknown) : await res.text();

  if (!res.ok) {
    const detail = (body as ApiErrorShape | null)?.detail;
    throw new ApiError(detail || res.statusText || 'Request failed', res.status, detail);
  }

  return body as T;
};

// Event API functions
export interface EventData {
  _id?: string;
  name: string;
  eventType: 'event' | 'test' | 'placement';
  date: string;
  time: string;
  imageUrl?: string;
  coordinator: string;
  capacity: number;
  department: string;
  description: string;
  views?: number;
  createdBy?: {
    _id: string;
    loginName: string;
    firstName: string;
    lastName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const eventApi = {
  // Get all events with optional filters
  getAll: async (filters?: { eventType?: string; department?: string }): Promise<{ events: EventData[] }> => {
    const params = new URLSearchParams();
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.department) params.append('department', filters.department);
    
    const queryString = params.toString();
    const path = `/events${queryString ? '?' + queryString : ''}`;
    return apiFetch<{ events: EventData[] }>(path);
  },

  // Get single event
  getById: async (id: string): Promise<EventData> => {
    return apiFetch<EventData>(`/events/${id}`);
  },

  // Create new event
  create: async (data: Omit<EventData, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<{ event: EventData }> => {
    return apiFetch<{ event: EventData }>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update event
  update: async (id: string, data: Partial<Omit<EventData, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>>): Promise<{ event: EventData }> => {
    return apiFetch<{ event: EventData }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete event
  delete: async (id: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Acknowledge/increment views for an event
  acknowledge: async (id: string): Promise<{ event: EventData }> => {
    return apiFetch<{ event: EventData }>(`/events/${id}/acknowledge`, {
      method: 'POST',
    });
  },
};

