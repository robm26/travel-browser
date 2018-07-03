# This is an AWS CLI shell command to publish the web app files to a specific S3 bucket
aws s3 sync . s3://mybucket --acl public-read
