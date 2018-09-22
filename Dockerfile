# Multi stage image
# Builder
FROM mhart/alpine-node:10 AS builder
MAINTAINER justprops

COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build



# Release image
FROM abiosoft/caddy
MAINTAINER justprops

RUN mkdir -p /var/www/html

EXPOSE 80

COPY docker/Caddyfile /etc/Caddyfile
COPY --from=builder /app/dist /var/www/html
WORKDIR /var/www/html
