#!/bin/sh

# Exit if any of the lines below fail! This is especially important if, for example, migrations fail.
# If we do not exit early, we end up running the application without the migrations or, if security groups
# haven't been properly setup, without a database!
set -e

# Run migrations
echo Starting migrations...
make migrate

echo Starting Gunicorn...
gunicorn woeip.wsgi \
    --workers=2 \
    --worker-class=gevent \
    --bind=0.0.0.0:8000 \
    --worker-tmp-dir=/dev/shm \
    "$@"
