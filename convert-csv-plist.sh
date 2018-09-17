#!/bin/bash
find ./ -iname '*.csv' -exec ./csv-to-plist.js {} \;
