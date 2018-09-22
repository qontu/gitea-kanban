# Multi stage image
# Builder
FROM mhart/alpine-node:10 AS builder
MAINTAINER justprops

WORKDIR /var/www/html



# Release image
FROM abiosoft/caddy
MAINTAINER justprops

RUN mkdir -p /var/www/html

EXPOSE 80

COPY docker/Caddyfile /etc/Caddyfile
COPY --from=builder /dist /var/www/html
