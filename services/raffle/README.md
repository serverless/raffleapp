# Raffle Service

Service for creating and managing raffles.


# API Reference

### Authentication

Authentication is handled via the `Authorization` header. The value should be a Bearer token that can be used to call the Auth0 `/userinfo` endpoint to return a user profile.

E.g.: `Authorization: Bearer qeEvJTia-_514S9Q`

Every email that ends with `@serverless.com` is an admin by default. You may specify additional admins on a per-raffle basis. See the `Create Raffle` endpoint below.

### Endpoints

#### Create Raffle

Create a new raffle shortcode

##### Authorization

- Profile must be using an email address that ends in `@serverless.com`

##### Endpoint

`POST /create`

##### Request

JSON object:

- `name` - `string` - required; Name of Raffle (e.g. _Serverless Meetup SF October 2017_).
- `description` - `string` - required; Description of Raffle.
- `admins` - `array` - optional; Additional list of email addresses to serve as admins for this raffle (i.e., meetup organizers outside of Serverless, Inc.)

##### Response

Status code:

- `200 OK` on success
- `400 Bad Request` on validation error.
- `401 Unauthorized` with a missing or invalid token.
- `403 Forbidden` with a token that is not admin.

JSON object:

- `shortcode` - `string` - Shortcode identifier for the raffle
- `name` - `string` - The name of the raffle

#### List Raffles

List the last 10 raffles.

##### Endpoint

`GET /`

##### Response

Status code:

- `200 OK` on success
- `401 Unauthorized` with a missing or invalid token.
- `403 Forbidden` with a token that is not admin.

Array of JSON objects:

- `shortcode` - `string` - Shortcode identifier for the raffle
- `name` - `string` - The name of the raffle
- `description` - `string` - The description of the raffle
- `createdAt` - `ISO8601 timestamp` - Time the raffle was created
- `winner` - `string` - Winner of the raffle, if there is one.

#### Get Raffle

Get information on a particular raffle

##### Endpoint

`GET /<shortcode>`

##### Response

Status code:

- `200 OK` on success
- `404 Not Found` if the raffle does not exist.

JSON response:

- `shortcode` - `string` - Shortcode identifier for the raffle
- `name` - `string` - The name of the raffle
- `description` - `string` - The description of the raffle
- `createdAt` - `ISO8601 timestamp` - Time the raffle was created
- `winner` - `string` - Winner of the raffle, if there is one.
- `registered` - `boolean` - Whether the current user is registered for this raffle.
- `admin` - `boolean` - Whether the current user is an admin for this raffle.
- `entries` - `array` - Array of email address for current entrants. This is only provided if the authenticated user is an admin.

#### Register for raffle

Register a user for a particular raffle

##### Endpoint

`POST /<shortcode>/register`

##### Response

Status code:

- `200 OK` on success
- `401 Unauthorized` if the user provides invalid authentication
- `404 Not Found` if the raffle does not exist.
- `409 Conflict` if the user has already registered for this raffle.

JSON response:

- `shortcode` - `string` - Shortcode identifier for the raffle
- `email` - `string` - The email address that was registered

#### Set winner for a raffle

Sets the winner for a particular raffle

##### Endpoint

`POST /<shortcode>/winner`

##### Request

JSON object:

- `email` - `string` - required; Email address of winner

##### Response

Status code:

- `200 OK` on success
- `400 Bad Request` on validation error
- `401 Unauthorized` if the user provides invalid authentication
- `404 Not Found` if the raffle does not exist.
- `409 Conflict` if the raffle already has a winner.

JSON response:

- `shortcode` - `string` - Shortcode identifier for the raffle
- `email` - `string` - The email address that was registered
