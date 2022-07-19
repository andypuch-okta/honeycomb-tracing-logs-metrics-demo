#!/bin/bash

max="$1"

echo "Simple Load Testing Tool"
echo "URL: http://localhost"
echo "Rate: $max calls / second"
echo ""

rando () {
  rNum=$(( $RANDOM % 6 + 0 ))
}

get () {
  rando

  echo "url: http://localhost?sleep=$rNum"
  curl -s --output /dev/null "http://localhost?sleep=$rNum"
}

while true
do
  for i in `seq 1 $max`
  do
    get $2 &
  done

  echo ''
  sleep 1
done
