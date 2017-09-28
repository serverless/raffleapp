# Raffle

A simple raffle application with a backend serverless service. The service provides functionaity exposed via an HTTP API. The routes are as follows:

- `POST /create`: Admin endpoint that creates a shortcode for a new raffle instance based on event name. Used to create a new raffle for an event. Returns an 8 character alphanumeric shortcode `xf4c85g9` that will be then used to do a raffle at `raffle.serverless.com/xf4c85g9`
- `GET /{shortcode}`: Admin endpoint that starts a raffle, and picks a winner
- `PUT /{shortcode}: Admin endpoint that ends a raffle, and inactivates it
- `POST /{shortcode}/register`: Public endpoint that lets user register for the raffle. Must pass in an identification method.

## Rules

- Admin functionality is protected by an Auth0 authorizer (/admin)
- Users must signup and login to the Platform to enter raffle
