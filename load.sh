#!/bin/bash

max="$1"
date
echo "url: $2
rate: $max calls / second"
START=$(date +%s);

rando () {
  rNum=$(( $RANDOM % 5 + 0 ))
}

get () {
  rando

  echo "url: $1?sleep=$rNum"

  curl -s -v "$1?sleep=$rNum" 2>&1 | tr '\r\n' '\\n' | awk -v date="$(date +'%r')" '{print $0"\n-----", date}' >> /tmp/perf-test.log
}

while true
do
  echo $(($(date +%s) - START)) | awk '{print int($1/60)":"int($1%60)}'
  sleep 1

  for i in `seq 1 $max`
  do
    get $2
    # get $2 &
  done
done