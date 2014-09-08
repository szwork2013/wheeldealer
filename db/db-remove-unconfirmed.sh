#!/bin/sh

DBNAME='appmoto'

echo "Removing unconfirmed advirsments"
/opt/mongodb/bin/mongo $DBNAME sql/db-remove-unconfirmed.js
