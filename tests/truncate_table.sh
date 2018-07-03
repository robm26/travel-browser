#!/bin/bash
# ################# WARNING! This script will delete all items in the table you specify

TABLE_NAME=$1
KEY=id

aws dynamodb scan --table-name $TABLE_NAME --attributes-to-get "id" --query "Items[].id.S" --output text | tr "\t" "\n" | xargs -t -I keyvalue aws dynamodb delete-item --table-name $TABLE_NAME --key '{"id": {"S": "keyvalue"}}'
