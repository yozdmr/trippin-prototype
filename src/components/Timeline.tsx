import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TripEvent } from '../types';
import { TimelineEvent } from './TimelineEvent';

interface TimelineProps {
  events: TripEvent[];
  onEditEvent: (event: TripEvent) => void;
  onReorder: (events: TripEvent[]) => void;
}

export const Timeline = ({ events, onEditEvent, onReorder }: TimelineProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = events.findIndex((e) => e.id === active.id);
      const newIndex = events.findIndex((e) => e.id === over.id);
      const reorderedEvents = arrayMove(events, oldIndex, newIndex);
      onReorder(reorderedEvents);
    }
  };

  return (
    <div className="px-4 py-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={events.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-300" />

            <div className="space-y-4">
              {events.map((event) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  onEdit={() => onEditEvent(event)}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
