export type EventType = 'activity' | 'meal' | 'transportation' | 'lodging';

export type TransportationType = 'major' | 'daily';

export interface TripEvent {
  id: string;
  type: EventType;
  name: string;
  location?: string;
  cost?: number;
  startDateTime: string;
  endDateTime?: string;
  timezone: string;
  transportationType?: TransportationType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  ownerId: string;
  collaboratorIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
}

export interface EventFormData {
  type: EventType;
  name: string;
  location?: string;
  cost?: number;
  startDateTime: string;
  endDateTime?: string;
  timezone: string;
  transportationType?: TransportationType;
}

export interface TripFormData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}
