import type { StorageAdapter } from '../types';

const STORAGE_PREFIX = 'izziv-10:';

export class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }
}

/** Prihodnja implementacija – sinhronizacija z REST API */
export class ApiStorageAdapter implements StorageAdapter {
  constructor(private baseUrl: string, private token?: string) {}

  private headers(): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  async get<T>(key: string): Promise<T | null> {
    const res = await fetch(`${this.baseUrl}/state/${key}`, { headers: this.headers() });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await fetch(`${this.baseUrl}/state/${key}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(value),
    });
  }

  async remove(key: string): Promise<void> {
    await fetch(`${this.baseUrl}/state/${key}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
  }
}

export const storage = new LocalStorageAdapter();
