# Raffle

A simple raffle application with a backend serverless service. The service provides functionaity exposed via an HTTP API. The routes are as follows:

- POST admin/create: Admin endpoint that creates a shortcode for a new raffle instance based on meetup name, and date/time of meetup. Used to create a new raffle for a meetup. Returns an 8 alphanumeric shortcode `xf4c85g9` that will be then used to do a raffle at `raffle.serverless.com/xf4c85g9`
- GET admin/raffle: Admin endpoint that starts a raffle, and picks a winner
- PUT admin/raffle: Admin endpoint that ends a raffle, and inactivates it
- POST /register: Public endpoint that lets user register for the raffle. Authenticates with the Serverless Platform via Auth0. Used to register a user for a raffle. Returns a 200 OK if successful, or an error if not signed up with Platform. If not signed up for the Platform, user is redirected to the signup page. The shortcode `xf4c85g9` from the initial raffle url is passed along. This endpoint should be mobile friendly.

## Rules

- Admin functionality is protected by an Auth0 authorizer (/admin)
- Users must signup and login to the Platform to enter raffle




