#!/usr/bin/env bash

# CloudFormation scripts

# aws dynamodb delete-table  --table-name askMemorySkillTable

# aws cloudformation validate-template --template-body file://travelbrowser.yaml

aws cloudformation package --template-file ./travelbrowser.yaml --s3-bucket alexaconsole789 --output-template-file ./travelbrowser-packaged.yaml

aws cloudformation deploy --template-file ./travelbrowser-packaged.yaml --stack-name travel-browser-stack  --capabilities CAPABILITY_IAM --parameter-overrides projectName=travel


