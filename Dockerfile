ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

USER 0:0

RUN apk add --no-cache \
    eudev-dev \
    g++ \
    jq \
    linux-headers \
    make \
    nodejs \
    nodejs-npm \
    python

WORKDIR /app

# Copy data for add-on
COPY . /app

RUN npm install --no-save --production

CMD [ "node", "index.js" ]
