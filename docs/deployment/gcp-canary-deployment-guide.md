# Least-Privilege GCP Deployment Script & Teardown Protocol

## 1. Bootstrap Setup (Founder Auth via ADC - NO JSON Keys Needed)

```bash
# Authenticate gcloud CLI locally via Application Default Credentials
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID

# Enable required GCP APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com storage.googleapis.com

# Create dedicated Artifact Registry repository & GCS Canary Bucket
gcloud artifacts repositories create filekit-worker-repo \
  --repository-format=docker \
  --location=europe-west1 \
  --description="FileKit Worker Container Repository"

gcloud storage buckets create gs://filekit-canary-staged-uploads \
  --location=europe-west1 \
  --uniform-bucket-level-access

# Create dedicated Runtime Service Account
gcloud iam service-accounts create filekit-worker-sa \
  --display-name="FileKit Worker Runtime Service Account"

# Bind least-privilege object-only role to Runtime SA
gcloud storage buckets add-iam-policy-binding gs://filekit-canary-staged-uploads \
  --member="serviceAccount:filekit-worker-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

---

## 2. Build & Deploy Image

```bash
# Configure Docker authentication for Artifact Registry
gcloud auth configure-docker europe-west1-docker.pkg.dev

# Build and tag image with explicit SHA
docker build -t europe-west1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/filekit-worker-repo/office-worker:v1.0.0 server/containers/office-worker/
docker push europe-west1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/filekit-worker-repo/office-worker:v1.0.0

# Deploy Cloud Run service with strict concurrency & instance limits
gcloud run deploy filekit-office-worker-canary \
  --image=europe-west1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/filekit-worker-repo/office-worker:v1.0.0 \
  --service-account=filekit-worker-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com \
  --region=europe-west1 \
  --no-allow-unauthenticated \
  --cpu=1.5 \
  --memory=1024Mi \
  --concurrency=1 \
  --max-instances=1 \
  --min-instances=0 \
  --timeout=30s \
  --ingress=internal
```

---

## 3. Manual Teardown & Immediate Cleanup Command

```bash
gcloud run services delete filekit-office-worker-canary --region=europe-west1 --quiet ; gcloud storage rm -r gs://filekit-canary-staged-uploads
```
