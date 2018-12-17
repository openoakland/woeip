FROM python:3.6-jessie

WORKDIR /app/woeip

ENV DJANGO_SETTINGS_MODULE woeip.settings
ENV PIPENV_DONT_USE_PYENV 1
ENV PIPENV_SYSTEM 1

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        gettext \
        libffi-dev \
        libgdal-dev \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip install pipenv

COPY Makefile /app/woeip
COPY Pipfile /app/woeip
COPY Pipfile.lock /app/woeip
COPY conf/wait-for-it.sh /app/woeip

RUN make requirements

COPY . /app/woeip

RUN mkdir -p /logs \
    && touch /logs/app.log \
    && touch /logs/gunicorn.log

ENV PUBLIC_ROOT /public
ENV LOG_FILE_PATH /logs
ENV ENABLE_LOGGING_TO_FILE true

VOLUME /public/media

EXPOSE 8000

ENTRYPOINT ["/app/woeip/docker-entrypoint.sh"]
