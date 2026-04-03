# Name

- The app is called Trippin'.

# Users

- Users are people who want to schedule vacations or trips live in collaboration their friend groups.

# Value proposition

An efficient way to collaborate with friends to organize, plan, schedule and finalize trips with friends.

# Key features

Simple mobile-friendly one-screen design with the app name and user profile icon at the top, and below it:
  - A vertical sequence of scheduled events, with the most recent events at the top and latest events at the bottom
  - A plus button in the bottom right that when clicked opens an event creation menu:
    - Can specify the event type (Hotel, Restaurant, Activity), name, cost, location address (optional)
    - Ensure the date and time can be selected (with timezone option)
Simple operations:
  - Name the trip at the top
  - Add an image for the trip as a background header
  - Click the plus icon to create a new event
  - Edit icon on existing events to modify their fields
  - Delete icon on existing events to remove events

# Example scenario

Here is an example session.

- Alice wants to go on a vacation.
- Alice starts the app on her phone. 
- It shows a homepage that asks for her initial destination, a vacation name, and a calendar where she can select the dates of her holiday.
- When selected, this takes her to the main page. There is a vertical timeline in the middle of the page. The top of the screen shows her vacation name and a grey banner where an optional photo can be selected. The theme of the app is a forest green.
- Alice taps on the big plus button in a circle on the bottom right of the screen. A small list appears above the button, providing options such as activity, meal, transportation, lodging.
- An overlay popup appears that asks her to enter the name of the activity, the location, the cost, and the duration period.
- After entering the information, the timeline now has one item. It appears as a cirlce on the timeline with a white box sticking out to the side. The timeline is now aligned on the left of the page.
- As Alice adds more activities, the timeline starts to fill up.
- Each circle can be moved up or down the timeline by dragging it along. Each box has an edit icon where the key information can be edited. There is a delete icon at the bottom of this popup.
- When Alice clicks on the transportation button, there are two options: major transit and daily transit. Major transit takes her to a popup where she can enter relevant information for transport such as flights and long train rides. This appears at the time when they are taken, and are slightly larger boxes than regular activity boxes. Daily transit appears as smaller boxes, colored light blue, in between activities.
- Meal items look the same as activity items, but are a different color/shade.
- Lodging items are placed at the top of the stay, and are still visible via a small top banner as the user scrolls past it as long as they stay there.

# Coding notes


# Testing notes
- Define unit tests for creating new items in the timeline.
- Define unit tests for editing items in the timeline.
- Define unit tests for deleting items in the timeline.
