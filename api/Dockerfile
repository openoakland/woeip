FROM python:3.6
ENV PYTHONUNBUFFERED 1 
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
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

ENTRYPOINT ["./entrypoint.sh"]
