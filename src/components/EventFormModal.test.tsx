import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventFormModal } from './EventFormModal';
import type { TripEvent } from '../types';

const mockEvent: TripEvent = {
  id: '1',
  type: 'activity',
  name: 'Visit Eiffel Tower',
  location: 'Paris, France',
  cost: 25,
  startDateTime: '2024-06-15T10:00',
  endDateTime: '2024-06-15T12:00',
  timezone: 'Europe/Paris',
  order: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('EventFormModal', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Creating a new event', () => {
    it('renders empty form for new event', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={false}
        />
      );

      expect(screen.getByRole('heading', { name: 'Add Event' })).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText(/Location/)).toHaveValue('');
    });

    it('allows selecting event type', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={false}
        />
      );

      const mealButton = screen.getByText('Meal').closest('button');
      if (mealButton) {
        fireEvent.click(mealButton);
      }

      expect(mealButton?.className).toContain('border-emerald-500');
    });

    it('submits form data when valid', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={false}
        />
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'New Activity' },
      });
      fireEvent.change(screen.getByLabelText('Start Date & Time'), {
        target: { value: '2024-06-15T10:00' },
      });

      const submitButton = screen.getByRole('button', { name: 'Add Event' });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Activity',
          startDateTime: '2024-06-15T10:00',
          type: 'activity',
        })
      );
    });

    it('calls onClose when cancel is clicked', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={false}
        />
      );

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('disables submit button when submitting', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={true}
        />
      );

      expect(screen.getByText('Saving...')).toBeDisabled();
    });
  });

  describe('Editing an existing event', () => {
    it('renders form with existing event data', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      expect(screen.getByText('Edit Event')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toHaveValue('Visit Eiffel Tower');
      expect(screen.getByLabelText(/Location/)).toHaveValue('Paris, France');
    });

    it('submits updated data when form is saved', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Updated Activity Name' },
      });

      fireEvent.click(screen.getByText('Save Changes'));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Activity Name',
        })
      );
    });

    it('shows delete button for existing events', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      expect(screen.getByText('Delete this event')).toBeInTheDocument();
    });
  });

  describe('Deleting an event', () => {
    it('shows confirmation before deleting', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      fireEvent.click(screen.getByText('Delete this event'));
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('calls onDelete when deletion is confirmed', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      fireEvent.click(screen.getByText('Delete this event'));
      fireEvent.click(screen.getByText('Confirm Delete'));

      expect(mockOnDelete).toHaveBeenCalled();
    });

    it('cancels deletion when cancel is clicked', () => {
      render(
        <EventFormModal
          event={mockEvent}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
          isSubmitting={false}
        />
      );

      fireEvent.click(screen.getByText('Delete this event'));

      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);

      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(screen.getByText('Delete this event')).toBeInTheDocument();
    });
  });

  describe('Transportation event type', () => {
    it('shows transportation type options when transportation is selected', () => {
      render(
        <EventFormModal
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isSubmitting={false}
        />
      );

      const transportButton = screen.getByText('Transportation').closest('button');
      if (transportButton) {
        fireEvent.click(transportButton);
      }

      expect(screen.getByText('Major Transit')).toBeInTheDocument();
      expect(screen.getByText('Daily Transit')).toBeInTheDocument();
    });
  });
});
