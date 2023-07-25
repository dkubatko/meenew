import os
import json

GCS_CREDENTIALS_PATH = os.getenv("MEENEW_GOOGLE_CLOUD_KEY")

if GCS_CREDENTIALS_PATH is None:
    raise EnvironmentError('Google Cloud credentials can not be found')

# For GCS Client authentication
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GCS_CREDENTIALS_PATH

GCS_BUCKET = 'meenew-menu-item-images'