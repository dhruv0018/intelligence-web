#!/usr/bin/env sh

# Setup database
mysql --user=root --execute='create database intelligence'
mysql --user=root --execute='create user "krossover"@"%" identified by "intelligence"'
mysql --user=root --execute='grant all on intelligence.* to "krossover"@"%"'

