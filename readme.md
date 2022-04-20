# JRC WebAdapter

## Description
JRC WebAdapter retrieves DIH and DIH-services data from https://s3platform.jrc.ec.europa.eu/digital-innovation-hubs-tool and map it in Orion-LD models.

The new entities are pushed into an array that is sent in chunks to Orion-LD

There is a built-in scheduler, so the adapter runs at chosen time intervals.

## Notes
JRC WebAdapter has an integrated DuplicateChecker because it doen't communicate with any Dymer

## Run
To install: `npm install`

To run: `npm run index`

## Environments
To configure environment and variables use .env file

*# URL extraction dih*
URL=https://s3platform-legacy.jrc.ec.europa.eu/digital-innovation-hubs-tool?p_p_id=digitalinnovationhub_WAR_digitalinnovationhubportlet&p_p_lifecycle=2&p_p_resource_id=obtain-hubs&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1&formDate=1639750597687&freeSearch=&evolStages=1&evolStages=3&evolStages=5&h2020=false&internalHubId=

*# Set Scheduler Interval*
INTERVAL=* * * * *
LOCAL_TIME=Europe/Rome

*# Templates*
DIH_TEMPLATE=templates/DIH_template.txt

*# Orion settings*
PROTOCOL=http
HOST=localhost
PORT=1026
ENTITIES_URI_PREFIX=urn:ngsi-ld:s3jrc:
ENTITIES_URI_PREFIX_SERVICE=urn:ngsi-ld-s3jrc-service:
NUMBER_OF_CONNECTION_RETRIES= 10

CHUNK_SIZE=50


*# DuplicateChecker settings*
RADIUS=0.005
UNIT=kilometres
STEPS=30