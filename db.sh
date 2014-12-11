#!/usr/bin/env bash

echo -n "Setting up DB... "
mysql --user=root -e "create database intelligence;" >/dev/null 2>&1
mysql --user=root -e "create user 'krossover'@'%' identified by 'intelligence'" >/dev/null 2>&1
mysql --user=root -e "grant all on intelligence.* to 'krossover'@'%'" >/dev/null 2>&1
echo "done."

echo -n "Downloading DB... "
aws s3 cp s3://misc-krossover-ops/dbdumps/prod_dump.sql dump.sql >/dev/null
printf "\r%-${COLUMNS}sDownloading DB... done.\n"

echo -n "Importing DB... "
mysql --user=krossover --password=intelligence intelligence < dump.sql >/dev/null 2>&1
echo "done."

