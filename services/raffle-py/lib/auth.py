class MissingAuthentication(Exception):
    pass


# Stub function for now. 
# Eventually, this will decode a JWT and return the email address.
def get_email(headers, required=True):
    auth = headers.get('Authorization')

    if not auth and required:
        raise MissingAuthentication()

    return auth


def can_create_raffle(email):
    # Only those with @serverless.com addresses can create a raffle.
    return email.endswith('@serverless.com')


def can_view_raffles(email):
    # Only those with @serverless.com addresses can view all raffles.
    return email.endswith('@serverless.com')


def is_raffle_admin(email, admins):
    return email.endswith('@serverless.com') or email in admins
