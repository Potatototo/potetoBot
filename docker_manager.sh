#!/bin/bash
function start() {
  docker build -rm -t potetobot_image .
  docker run -d -name potetobot_container potetobot_image
}

function stop() {
  docker stop potetobot_container && docker rm potetobot_container
}

function restart() {
  stop
  start
}

function_exists() {
  declare -f -F $1 > /dev/null
  return $?
}

if [ $# -lt 1 ]
then
  echo "Usage : $0 start|stop|restart "
  exit
fi

case "$1" in
  start)    function_exists start && start
          ;;
  stop)  function_exists stop && stop
          ;;
  restart)  function_exists restart && restart
          ;;
  *)      echo "Invalid command - Valid->start|stop|restart"
          ;;
esac