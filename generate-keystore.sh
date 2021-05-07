#!/bin/sh
keytool -genkey -v -keystore esecrets-key -alias esecrets -keyalg RSA -keysize 2048 -validity 10000
