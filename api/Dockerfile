FROM python:3.9.4
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
      postgresql-client \
      build-essential \
      libffi-dev \
      libgdal-dev \
      libssl-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip install -U pip

ARG PYTHON_ENV
COPY requirements/${PYTHON_ENV}.txt requirements.txt
RUN pip install -r requirements.txt

COPY . ./

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENTRYPOINT ["./entrypoint.sh"]
