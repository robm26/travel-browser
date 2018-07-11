#!/usr/bin/env bash
cd ../lambda/custom
zip  ../../sam/skill-lambda/index.zip . -r
cd ../../sam

aws lambda update-function-code --function-name TravelBrowser --zip-file fileb://skill-lambda/index.zip

# cp ./index.zip ../sam/skill-lambda/memory-skill.zip
