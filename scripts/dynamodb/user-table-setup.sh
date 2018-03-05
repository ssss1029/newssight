echo "Removing table Users"
aws dynamodb delete-table --table-name Users

echo "Creating table Users"
aws dynamodb create-table --cli-input-json file://json/table-users.json
echo "Done creating table Users"

echo "Waiting for DB to finish CREATING stage. This may take a while"
aws dynamodb wait table-exists --table-name Users

echo "Inserting dummy User object 1"
aws dynamodb put-item --cli-input-json file://json/sample-user-1.json

echo "Inserting dummy User object 2"
aws dynamodb put-item --cli-input-json file://json/sample-user-2.json

echo "Inserting dummy User object 3"
aws dynamodb put-item --cli-input-json file://json/sample-user-3.json

echo "Printing current contents of User table"
aws dynamodb scan --table-name Users 