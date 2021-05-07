#!/bin/sh
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore esecrets-key.keystore android/app/build/outputs/apk/debug/app-debug.apk esecrets
