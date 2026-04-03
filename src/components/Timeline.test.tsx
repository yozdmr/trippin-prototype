import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timeline } from './Timeline';
import type { TripEvent } from '../types';

const mockEvents: TripEvent[] = [
  {
    id: '1',
    type: 'activity',
    name: 'Visit Eiffel Tower',
    location: 'Paris, France',
    cost: 25,
    startDateTime: '2024-06-15T10:00',
    timezone: 'Europe/Paris',
    order: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'meal',
    name: 'Dinner at Restaurant',
    location: 'Paris, France',
    cost: 100,
    startDateTime: '2024-06-15T19:00',
    timezone: 'Europe/Paris',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    type: 'transportation',
    name: 'Flight to Paris',
    transportationType: 'major',
    startDateTime: '2024-06-14T08:00',
    timezone: 'America/New_York',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('Timeline', () => {
  const mockOnEditEvent = vi.fn();
  const mockOnReorder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all events in the timeline', () => {
    render(
      <Timeline
        events={mockEvents}
        onEditEvent={mockOnEditEvent}
        onReorder={mockOnReorder}
      />
    );

    expect(screen.getByText('Visit Eiffel Tower')).toBeInTheDocument();
    expect(screen.getByText('Dinner at Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Flight to Paris')).toBeInTheDocument();
  });

  it('displays event locations when provided', () => {
    render(
      <Timeline
        events={mockEvents}
        onEditEvent={mockOnEditEvent}
        onReorder={mockOnReorder}
      />
    );

    expect(screen.getAllByText(/Paris, France/)).toHaveLength(2);
  });

  it('calls onEditEvent when an event is clicked', () => {
    render(
      <Timeline
        events={mockEvents}
        onEditEvent={mockOnEditEvent}
        onReorder={mockOnReorder}
      />
    );

    const activityEvent = screen.getByText('Visit Eiffel Tower').closest('button');
    if (activityEvent) {
      fireEvent.click(activityEvent);
    }

    expect(mockOnEditEvent).toHaveBeenCalledWith(mockEvents[0]);
  });

  it('renders empty timeline when no events', () => {
    const { container } = render(
      <Timeline
        events={[]}
        onEditEvent={mockOnEditEvent}
        onReorder={mockOnReorder}
      />
    );

    const eventButtons = container.querySelectorAll('button');
    expect(eventButtons).toHaveLength(0);
  });

  it('displays different styles for different event types', () => {
    render(
      <Timeline
        events={mockEvents}
        onEditEvent={mockOnEditEvent}
        onReorder={mockOnReorder}
      />
    );

    const activityButton = screen.getByText('Visit Eiffel Tower').closest('button');
    const mealButton = screen.getByText('Dinner at Restaurant').closest('button');

    expect(activityButton?.className).toContain('bg-white');
    expect(mealButton?.className).toContain('bg-orange');
  });
});
