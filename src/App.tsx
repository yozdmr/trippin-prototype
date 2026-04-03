import { useMemo, useState } from 'react'
import { AddTripFab } from './components/AddTripFab'
import { AppHeader } from './components/AppHeader'
import { BudgetModal } from './components/BudgetModal'
import { BudgetPanel } from './components/BudgetPanel'
import { EventFormModal } from './components/EventFormModal'
import { ItinerarySection } from './components/ItinerarySection'
import { LoadingScreen } from './components/LoadingScreen'
import { LocalModeNotice } from './components/LocalModeNotice'
import { SettingsModal } from './components/SettingsModal'
import { SyncErrorBanner } from './components/SyncErrorBanner'
import { TripActionBar } from './components/TripActionBar'
import { TripBannerSection } from './components/TripBannerSection'
import { getFirebaseClients } from './services/firebaseClient'
import { useTripState } from './hooks/useTripState'
import type { TripEvent } from './types/trip'
import {
  budgetSpendColor,
  getConflictingEventIds,
  perPersonShare,
  totalEventCost,
} from './utilities/tripLogic'

export function App() {
  const firebase = useMemo(() => getFirebaseClients(), [])
  const { trip, ready, mode, syncError, updateTrip, addEvent, updateEvent, deleteEvent, uploadBanner } =
    useTripState(firebase)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [eventModal, setEventModal] = useState<{ mode: 'create' | 'edit'; event?: TripEvent } | null>(null)

  const conflicts = useMemo(() => getConflictingEventIds(trip.events), [trip.events])
  const total = useMemo(() => totalEventCost(trip.events), [trip.events])
  const share = useMemo(() => perPersonShare(total, trip.collaboratorCount), [total, trip.collaboratorCount])
  const spendColor = useMemo(() => budgetSpendColor(total, trip.budget), [total, trip.budget])

  if (!ready) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <AppHeader />

      {syncError ? <SyncErrorBanner message={syncError} /> : null}

      {mode === 'local' ? <LocalModeNotice /> : null}

      <TripBannerSection tripName={trip.tripName} bannerUrl={trip.bannerUrl} />

      <TripActionBar onOpenSettings={() => setSettingsOpen(true)} onOpenBudget={() => setBudgetOpen(true)} />

      <BudgetPanel
        total={total}
        budget={trip.budget}
        collaboratorCount={trip.collaboratorCount}
        share={share}
        spendColor={spendColor}
      />

      <ItinerarySection
        events={trip.events}
        conflicts={conflicts}
        onEditEvent={(ev) => setEventModal({ mode: 'edit', event: ev })}
        onDeleteEvent={deleteEvent}
      />

      <AddTripFab onClick={() => setEventModal({ mode: 'create' })} />

      {settingsOpen ? (
        <SettingsModal
          tripName={trip.tripName}
          collaboratorCount={trip.collaboratorCount}
          onClose={() => setSettingsOpen(false)}
          onSave={(name, count) => {
            updateTrip({ tripName: name, collaboratorCount: count })
            setSettingsOpen(false)
          }}
          onBannerFile={(file) => void uploadBanner(file)}
        />
      ) : null}

      {budgetOpen ? (
        <BudgetModal
          budget={trip.budget}
          onClose={() => setBudgetOpen(false)}
          onSave={(b) => {
            updateTrip({ budget: b })
            setBudgetOpen(false)
          }}
        />
      ) : null}

      {eventModal ? (
        <EventFormModal
          key={eventModal.mode === 'edit' ? eventModal.event?.id : 'new'}
          mode={eventModal.mode}
          initial={eventModal.event}
          onClose={() => setEventModal(null)}
          onSubmit={(payload) => {
            if (eventModal.mode === 'create') {
              addEvent(payload)
            } else if (eventModal.event) {
              updateEvent(eventModal.event.id, payload)
            }
            setEventModal(null)
          }}
        />
      ) : null}
    </div>
  )
}
