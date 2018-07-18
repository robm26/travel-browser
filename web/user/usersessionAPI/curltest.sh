#!/usr/bin/env bash
clear
echo

curl https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/lookup?tempPassPhrase=sweet-dog-721

# curl --data "tempPassPhrase=loud-door-342" https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod/lookup

## Post data
# curl -H "Content-Type: application/json" -X POST -d '{"attributes": {"namePronounce":"Dani Yell"}}' https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721

## Post data with file content

# curl -X POST -H "Content-Type: application/json" -d '{"attributes":{}, "file":"'"$(base64 ./lambda/helloworld.mp3)"'"}' https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721

## GOOD
# curl -X POST -H "Content-Type: application/json" -d '{"attributes":{"audioClip":"new"}, "file": "TXkgTmFtZSBpcyBSb2JlcnQ=" }' https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721
# curl -X POST -H "Content-Type: application/json" -d '{"attributes":{"audioClip":"new"}, "file": "'"$( base64 ./lambda/helloworld.mp3 )"'"}' https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721

# (echo -n '{"attributes":{"audioClip":"new"}, "file": "'; base64 ./lambda/helloworld.mp3; echo '"}') | curl -H "Content-Type: application/json" -d @-  https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721

# https://s3.amazonaws.com/skill-images-789/mp3/user/Rec1.mp3

# curl --header "Content-Type:application/octet-stream" --trace-ascii debugdump.txt --data-binary @helloworld.mp3 https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod/lookup?tempPassPhrase=sweet-dog-721

# curl https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/dev/up?tempPassPhrase=sweet-dog-721
echo

