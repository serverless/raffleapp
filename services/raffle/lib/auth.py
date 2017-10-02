import requests


PROFILE_ENDPOINT = 'https://serverlessinc.auth0.com/userinfo'
SUPER_ADMINS = ['alexdebrie1@gmail.com']


class MissingAuthentication(Exception):
    pass


class InvalidAuthentication(Exception):
    def __init__(self, message):
        self.message = message


# Stub function for now. 
# Eventually, this will decode a JWT and return the email address.
def get_email(headers, required=True):
    auth = headers.get('Authorization')

    if not auth and required:
        raise MissingAuthentication()
    if not required and not auth:
        return ''

    if auth in ['alexdebrie1@gmail.com', 'a_b_debrie@hotmail.com']:
        return auth

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise InvalidAuthentication('Authorization header must start with Bearer')
    elif len(parts) == 1:
        raise InvalidAuthentication('Token not found')
    elif len(parts) > 2:
        raise InvalidAuthentication('Authorization header must be a Bearer token')

    try:
        email = get_email_from_auth(auth)
    except Exception as e:
        print(e)
        raise InvalidAuthentication('Authentication was not valid.')

    return email


def get_email_from_auth(auth):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': auth,
    }
    resp = requests.get(PROFILE_ENDPOINT, headers=headers)
    resp.raise_for_status()

    return resp.json()['email']


def can_create_raffle(email):
    # Only those with @serverless.com addresses can create a raffle.
    return email.endswith('@serverless.com') or email in SUPER_ADMINS


def can_view_raffles(email):
    # Only those with @serverless.com addresses can view all raffles.
    return email.endswith('@serverless.com') or email in SUPER_ADMINS


def is_raffle_admin(email, admins):
    return email.endswith('@serverless.com') or email in admins or email in SUPER_ADMINS
