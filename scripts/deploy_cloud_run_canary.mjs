import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('▶ Least-Privilege GCP Cloud Run Canary Deployment Automation Script');
console.log('================================================================================');
console.log('Prerequisites:');
console.log('  1. Founder authenticates locally via gcloud:');
console.log('     gcloud auth login');
console.log('     gcloud auth application-default login');
console.log('  2. Project ID set: gcloud config set project <PROJECT_ID>');
console.log('================================================================================\n');

const deploymentSpec = {
  region: 'europe-west1',
  serviceName: 'filekit-office-worker-canary',
  repositoryName: 'filekit-worker-repo',
  runtimeServiceAccount: 'filekit-worker-sa',
  bucketName: 'filekit-canary-staged-uploads',
  leastPrivilegeRoles: {
    deployer: [
      'roles/run.developer',
      'roles/artifactregistry.writer',
      'roles/iam.serviceAccountUser',
    ],
    runtimeServiceAccount: [
      'roles/storage.objectAdmin (Scoped strictly to gs://filekit-canary-staged-uploads)',
    ],
    invoker: [
      'roles/run.invoker (Private test caller only; unauthenticated access DISABLED)',
    ],
  },
  cloudRunConfigFlags: [
    '--region=europe-west1',
    '--no-allow-unauthenticated',
    '--cpu=1.5',
    '--memory=1024Mi',
    '--concurrency=1',
    '--max-instances=1',
    '--min-instances=0',
    '--timeout=30s',
    '--ingress=internal',
  ],
  teardownCommand: 'gcloud run services delete filekit-office-worker-canary --region=europe-west1 --quiet ; gcloud storage rm -r gs://filekit-canary-staged-uploads',
};

const scriptOutput = `# Least-Privilege GCP Deployment Script & Teardown Protocol

## 1. Bootstrap Setup (Founder Auth via ADC - NO JSON Keys Needed)

\`\`\`bash
# Authenticate gcloud CLI locally via Application Default Credentials
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID

# Enable required GCP APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com storage.googleapis.com

# Create dedicated Artifact Registry repository & GCS Canary Bucket
gcloud artifacts repositories create ${deploymentSpec.repositoryName} \\
  --repository-format=docker \\
  --location=${deploymentSpec.region} \\
  --description="FileKit Worker Container Repository"

gcloud storage buckets create gs://${deploymentSpec.bucketName} \\
  --location=${deploymentSpec.region} \\
  --uniform-bucket-level-access

# Create dedicated Runtime Service Account
gcloud iam service-accounts create ${deploymentSpec.runtimeServiceAccount} \\
  --display-name="FileKit Worker Runtime Service Account"

# Bind least-privilege object-only role to Runtime SA
gcloud storage buckets add-iam-policy-binding gs://${deploymentSpec.bucketName} \\
  --member="serviceAccount:${deploymentSpec.runtimeServiceAccount}@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \\
  --role="roles/storage.objectAdmin"
\`\`\`

---

## 2. Build & Deploy Image

\`\`\`bash
# Configure Docker authentication for Artifact Registry
gcloud auth configure-docker ${deploymentSpec.region}-docker.pkg.dev

# Build and tag image with explicit SHA
docker build -t ${deploymentSpec.region}-docker.pkg.dev/YOUR_GCP_PROJECT_ID/${deploymentSpec.repositoryName}/office-worker:v1.0.0 server/containers/office-worker/
docker push ${deploymentSpec.region}-docker.pkg.dev/YOUR_GCP_PROJECT_ID/${deploymentSpec.repositoryName}/office-worker:v1.0.0

# Deploy Cloud Run service with strict concurrency & instance limits
gcloud run deploy ${deploymentSpec.serviceName} \\
  --image=${deploymentSpec.region}-docker.pkg.dev/YOUR_GCP_PROJECT_ID/${deploymentSpec.repositoryName}/office-worker:v1.0.0 \\
  --service-account=${deploymentSpec.runtimeServiceAccount}@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com \\
  ${deploymentSpec.cloudRunConfigFlags.join(' \\\n  ')}
\`\`\`

---

## 3. Manual Teardown & Immediate Cleanup Command

\`\`\`bash
${deploymentSpec.teardownCommand}
\`\`\`
`;

const docsDir = path.join(rootDir, 'docs', 'deployment');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(path.join(docsDir, 'gcp-canary-deployment-guide.md'), scriptOutput, 'utf-8');

console.log('✓ Deployment guide generated: docs/deployment/gcp-canary-deployment-guide.md');
