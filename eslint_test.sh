#!/bin/bash

rm -f .js-ok
eslint scripts/*
if [ $? -ne 0 ]; then
  touch .js-ok
fi