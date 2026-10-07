# Rides service (plain English)

## ask

- Get one ride by id.
- List rides, optionally filtered by status, with a page size and starting offset.

## send

- To create a ride: pickup place and dropoff place (both required).
- To read or list: an id in the path, or query filters for the list.
- Callers prove who they are with a bearer token.

## return

- One ride: id and status.
- A list: the rides on this page, plus the limit and offset used.
- A create: the new ride (id and status).

## wrong

- Bad create payload (missing pickup or dropoff): say what went wrong.
- Unknown ride id: say it was not found.
