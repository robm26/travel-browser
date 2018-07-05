#!/usr/bin/env bash
clear
./deploylambda.sh
echo
# curl  https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod/lookup?tempPassPhrase=loud-door-342

# curl --data "tempPassPhrase=loud-door-342" https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod/lookup

# curl -H "Content-Type: application/json" -X POST -d '{"attributes": {"namePronounce":"leah33"}}' https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=deep-record-758
echo
echo


