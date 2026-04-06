// This file defines TypeScript interfaces for trip data structures.

// The total budget for a trip, stored in USD.
export type Budget = number;

// Permission levels for shared users (trip creator is always full-owner).
//  admin  – full access: delete trip/days/events, edit everything, remove users
//  editor – edit days/events/budget, invite users; cannot delete or kick
//  viewer – view-only + invite people
export type TripRole = 'admin' | 'editor' | 'viewer';

export interface Trip {
  id: string;
  userId: string;        // UID of the Firebase Auth user who owns this trip
  name: string;
  startDate: Date;       // The calendar date the trip begins
  budget: Budget;        // Total trip budget in USD
  bannerImageUrl: string | null;  // null = use default green background
  shared: string[];     // UIDs of users this trip has been shared with
  roles: Record<string, TripRole>; // uid → role for shared users
  // Days are stored in the subcollection trips/{tripId}/days — see firestoreDayService.ts
}
