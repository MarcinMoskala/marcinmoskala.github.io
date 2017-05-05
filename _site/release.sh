#!/bin/bash
# USAGE: ./release.sh 2.2.2

if [ $# -eq 0 ]
  then
    echo "USAGE: ./release.sh \"Commit message\""
   exit
fi

git add -A
git commit -m "$1"
git push origin master