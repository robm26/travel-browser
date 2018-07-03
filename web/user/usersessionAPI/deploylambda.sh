#!/usr/bin/env bash
rm index.zip
cd lambda
zip  ../index.zip * –X -r
# read -n1 -r -p "Zip complete, press space to deploy..." key
cd ..
aws lambda update-function-code --function-name AlexaMemoryUserProfileFunction --zip-file fileb://index.zip
# cp ./index.zip ../../../sam/console-user/userconsoleAPIfunction.zip
