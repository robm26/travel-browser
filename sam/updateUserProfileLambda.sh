#!/usr/bin/env bash
cd ../web/user/usersessionAPI/lambda

zip  ../../../../sam/console-user/index.zip . -r

cd ../../../../sam/console-user

aws lambda update-function-code --function-name AlexaMemoryUserProfileFunction --zip-file fileb://index.zip
cd ..

# cp ./index.zip ../sam/skill-lambda/memory-skill.zip
