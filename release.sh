#!/bin/sh

cd android && \
./gradlew assembleRelease && \
cd app/build/outputs/apk/release && \
jarsigner -verbose -keystore /fontes/secrets/keystore/esecrets-key.keystore -storepass 2tee2222 app-release-unsigned.apk esecrets && \
/home/higor/Android/Sdk/build-tools/30.0.3/zipalign -v 4 app-release-unsigned.apk esecrets.apk
