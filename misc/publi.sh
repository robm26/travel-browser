#!/usr/bin/env bash
aws s3 sync ./img/ s3://skill-images-789/travel/ --acl public-read