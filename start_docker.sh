#!/bin/sh
printf 'compiling...\n'
docker build -t potetobot .
printf 'starting bot in background...\n'
docker run -d potetobot