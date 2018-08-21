#!/usr/bin/env bash

S3_BUCKET="alexaconsole789"

    cd ../lambda
    rm index.zip
    cd custom
    zip  ../index.zip * –X -r
    cd ..
#   aws lambda update-function-code --function-name MyFunction --zip-file fileb://index.zip
    cd ../sam


    cd ../web/user/usersessionAPI
    rm index.zip
    cd lambda
    zip ../index.zip * -X -r
    cd ../../../../sam

# CloudFormation scripts

# aws cloudformation validate-template --template-body file://travelbrowser.yaml

aws cloudformation package --template-file ./travelbrowser.yaml --s3-bucket $S3_BUCKET --output-template-file ./travelbrowser-packaged.yaml

# aws s3 cp ./travelbrowser-packaged.yaml s3://skill-building-labs/travel-browser/ --acl public-read

aws cloudformation deploy --template-file ./travelbrowser-packaged.yaml --stack-name travel-browser-stack  --capabilities CAPABILITY_IAM --parameter-overrides projectName=travel


