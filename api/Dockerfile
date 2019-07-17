ARG PYTHON_VERSION=3.6-alpine

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


# Final build
FROM python:${PYTHON_VERSION}

# Install run dependencies
# gdal-dev geos-dev proj-dev are required by geodjango

RUN apk add --no-cache \
    --upgrade \
    --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
    alpine-sdk \
    gdal-dev \
    geos-dev \
    proj-dev \
    && rm -rf /var/cache/apk/*

COPY --from=builder /install /usr/local

COPY . /app

WORKDIR /app

RUN mkdir -p /logs \
    && touch /logs/app.log \
    && touch /logs/gunicorn.log

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
