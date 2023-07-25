from .. import configs
import hashlib
import time
from google.cloud import storage
from fastapi import UploadFile

class GCS:
  def __init__(self):
    client = storage.Client()
    self.bucket = client.bucket(configs.GCS_BUCKET)

  def upload_file(self, source_file: UploadFile):
    if source_file.filename is None:
      return None
    
    # generate a unique blob name using the filename and a hash
    hash = hashlib.sha256()
    hash.update((source_file.filename + str(time.time())).encode('utf-8'))
    blob_name = f"{source_file.filename}_{hash.hexdigest()}"

    blob = self.bucket.blob(blob_name)
    blob.upload_from_string(source_file.file.read())

    return blob.public_url