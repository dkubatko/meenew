from .. import configs
import hashlib
import filetype
from google.cloud import storage
from fastapi import UploadFile, HTTPException

class GCS:
    def __init__(self):
        client = storage.Client.from_service_account_info(configs.GCS_CREDENTIALS)
        self.bucket = client.bucket(configs.GCS_BUCKET)
      
    def get_mime_type(self, file_obj):
      kind = filetype.guess(file_obj)
      if kind is None:
          return None
      return kind.mime

    def compute_sha256(self, upload_file, chunk_size=8192):
        """Compute SHA-256 hash of an uploaded file."""
        hasher = hashlib.sha256()
        for chunk in iter(lambda: upload_file.file.read(chunk_size), b''):
            hasher.update(chunk)
        # Reset file pointer to the beginning after reading
        upload_file.file.seek(0)
        return hasher.hexdigest()
    
    def check_image(self, upload_file: UploadFile, chunk_size=8192):
        # Use filetype to determine the MIME type of the file
        mime = self.get_mime_type(upload_file.file)
        
        allowed_mimes = ['image/png', 'image/jpeg']
        
        if mime not in allowed_mimes:
            raise HTTPException(status_code=400, detail="Invalid file type. Only .png, .jpeg, .jpg are allowed.")
        
        # Compute file size by reading it in chunks to avoid memory overflow
        total_size = 0
        for chunk in iter(lambda: upload_file.file.read(chunk_size), b''):
            total_size += len(chunk)
            
            if total_size > configs.MAX_UPLOAD_FILE_SIZE:
                raise HTTPException(status_code=400, detail="File size exceeds 25MB")
        
        # Reset the file pointer to the start after reading
        upload_file.file.seek(0)


    def upload_file(self, source_file: UploadFile):
        if source_file.filename is None:
            return None

        # Read file content and compute its hash
        file_hash = self.compute_sha256(source_file)

        # Use the hash as part of the blob name
        blob_name = f"{source_file.filename}_{file_hash}"

        # Check if this blob already exists
        blob = self.bucket.blob(blob_name)
        if blob.exists():
            print(f"Blob {blob_name} already exists!")
            return blob.public_url

        # Upload the file
        file_content = source_file.file.read()
        blob.upload_from_string(file_content)

        return blob.public_url