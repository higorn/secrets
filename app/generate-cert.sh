#!/bin/sh
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  -keyout key.pem -out cert.pem -subj "/CN=keepsecret.io" \
  -addext "subjectAltName=DNS:keepsecret.io,DNS:www.keepsecret.net,IP:192.168.0.102"

