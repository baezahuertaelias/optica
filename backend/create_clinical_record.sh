#!/bin/bash

# Define API endpoints and credentials
AUTH_URL="http://localhost:5000/auth/login"
CLINICAL_RECORDS_URL="http://localhost:5000/clinicalRecords/"
USERNAME="admin"
PASSWORD="123.Admin."

# Step 1: Login to get the token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $AUTH_URL \
    --header 'Content-Type: application/json' \
    --data-raw "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

# Extract the token from the login response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# Check if the token is valid
if [ -z "$TOKEN" ]; then
  echo "Failed to retrieve token. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Token retrieved successfully."

# Step 2: Create a new clinical record using the token
echo "Creating a new clinical record..."


CLINICAL_RECORD_DATA='{"patientId":2,"userId":1,"anamnesis":"kk","otherExam":"1","observations":"1","indicationId":1,"controlId":4,"latestClinicalDate":"2025-05-05T04:00:00.000Z","ophthalmologicalMedicalHistory":"kk","familyMedicalHistory":"1","generalMedicalHistory":"1","updatedAt":"2025-05-22T06:34:43.390Z","createdAt":"2025-05-22T06:34:43.390Z"}'

CREATE_RESPONSE=$(curl -s -X POST $CLINICAL_RECORDS_URL \
    --header "Authorization: Bearer $TOKEN" \
    --header 'Content-Type: application/json' \
    --data-raw "$CLINICAL_RECORD_DATA")

echo "Response from creating clinical record:"
echo $CREATE_RESPONSE