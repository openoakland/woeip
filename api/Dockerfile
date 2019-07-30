ARG PYTHON_VERSION=3.6-alpine

# ---------------------
# STEP 1
# Install application dependencies
# -----------------------

FROM python:${PYTHON_VERSION} as builder

# Install build dependencies: argon2 needs libffi-dev, psycopg needs postgresql-dev
RUN apk add --no-cache \
    --upgrade \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
    build-base \
    libffi-dev \
    postgresql-dev

ARG PYTHON_ENV

RUN mkdir /install
WORKDIR /install

COPY requirements/${PYTHON_ENV}.txt /requirements.txt
RUN pip install -U pip \
    && pip install --install-option="--prefix=/install" -r /requirements.txt


# ---------------------
# STEP 2
# Install geodjango dependencies
# Start gunicorn server
# -----------------------
FROM python:${PYTHON_VERSION}

RUN apk add --no-cache \
    --upgrade \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
    alpine-sdk \
    gdal-dev \
    geos-dev \
    proj-dev \
    && rm -rf /var/cache/apk/*

# Copy compiled library binaries
COPY --from=builder /install /usr/local

WORKDIR /usr/src/app

COPY . ./

RUN mkdir -p /logs \
    && touch /logs/app.log \
    && touch /logs/gunicorn.log

ENTRYPOINT ["./entrypoint.sh"]
