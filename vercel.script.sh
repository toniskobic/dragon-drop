#!/bin/bash
if [[ "$VERCEL_GIT_BRANCH" != "main" ]]; then
  echo "Branch: $VERCEL_GIT_BRANCH"
  echo "Skip building branch $VERCEL_GIT_BRANCH"
  exit 1
fi
