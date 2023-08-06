import os
import json
import base64

def get_gcs_credentials():
    credentials_b64 = os.getenv("MEENEW_GOOGLE_CLOUD_KEY_B64")
    if credentials_b64 is None:
        raise ValueError("MEENEW_GOOGLE_CLOUD_KEY_B64 environment variable is not set")

    credentials_json = base64.b64decode(credentials_b64).decode('utf-8')
    credentials_dict = json.loads(credentials_json)

    return credentials_dict

def get_db_credentaials():
    db_keys = ['MEENEW_DB_USER', 'MEENEW_DB_PASSWORD', "MEENEW_DB_HOST"]
    env_vars = {key: os.environ.get(key) for key in db_keys}

    for key, value in env_vars.items():
        if value is None:
            raise ValueError(f"{key} environment vairable is not set")

    return env_vars

GCS_CREDENTIALS = get_gcs_credentials()
GCS_BUCKET = 'meenew-menu-item-images'