#!/bin/bash
if [[ "$VERCEL_GIT_BRANCH" != "main" ]]; then
  echo "Skip building branch $VERCEL_GIT_BRANCH"
  exit 1
fi
