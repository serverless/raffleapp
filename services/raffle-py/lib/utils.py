import uuid


def generate_shortcode():
    return str(uuid.uuid4())[:8]
