## TODO update with latest


- [ ] Create clean table structure and files structure

```
events
status - optimized what we save every interval? Start with saving it all. 
debug - save everything evey tick. Can be blown away at any time. 
```

- [ ] Make observable grill status a dir, and break out individual observables which can be tested with marbles. 
- [ ] Subsribers very leightweight, connect to logging or to datastore events.
- [ ] Add a unit test to demo a hex / message into an expected grill status, so we can make sure we are storing the right data to do this in future. 
 

Then

- [ ] Update chart to visualize events (mark series) and status (line charts)


---------


- [x] knowing each socket connection is different we need to refactor that a bit. Create a socket for pinging status, and in sendCommand create a new socket each time and listen for its response.
- [ ] Use sendGrillCOmmandOnce for polling. Make async. Create grill status still in service.
  - Seems to have other errors with this - not sure if its better to open one long polling or to keep opening many shot polls. 


- [ ] Capture other grill errors? See https://github.com/Aenima4six2/gmg/commit/614589cf775422e394f4529b4befbe8ac33bbdf0 

‭

## Structure

This project is based on structure in this article: https://softwareontheroad.com/ideal-nodejs-project-structure/. A quick read over will help you better navigate this project.


## Command API

Command api allows for remote control of your GMG. A few implementation notes

- All endpoints are GET requests for now, to make them easy to debug in browser
- Since endpoints command an actual thing which can be dangerous, a confirmation pattern is used. The first request to each endpoint returns a code and a link, following the link actually executes the command.

Here are the api endpoints

```
GET /command/power/on
GET /command/power/off
GET /command/power/cold-smoke

GET /command/temp/grill
GET /command/temp/probe1
GET /command/temp/probe2

GET /command/settings/pizza
GET /command/settings/regular
```

## Status API

Basic API to get status of grill as stored in local state. Status is updated approx 1-5 seconds by pinging grill and waiting for response message. It's not reccomdend to use this for polling. Instead, talk directory to the database, see examples TODO

```
GET /status

```

## Real-time API 

TODO document 



---------------

Old notes

# Overview

The point is a useful webapp for visualizing and tracking Green Mountain Grill cooks. This is a proof of concept which uses the work from https://github.com/Aenima4six2/gmg to decode the grill status which is sent over UDP when the grill gets the right command. This code aims to be much simplier to reason than Aenima4six2/gmg, and easier to get running and customize. 

This spike write data to a CSV as a database (which proved to be more trouble than worth) and visualizes prob1 temp using a ascii line chart. Another command prompt can run a real-time dashboard, although its very buggy due to reading / writing to files. 

To get started 

- Install deps `npm install`
- Configure for your grill in `./config.js`
- Run `npm run start`
- Additionally, in a new command window, run `npm run dashboard`
- See CSV generated in `./data` folder

# Next steps

- Use a real database to sync data from server to client
- Test and reafactor the GrillStatus class
- Add react front-end with proper graphs.
- Try sending commands? 
- Debug profiles and what they are all about - do we need them if we can set a profile on this? 




# Useful links

- https://community.hubitat.com/t/release-green-mountain-grill/34720

Debugging wireshark data from iPhone 

http://www.gilles-bertrand.com/2016/07/iphoneappwebtrafficcaptureproxymachttpsniffer.html


```
in command line
rvictl -s ##
rvictl -x ##


```

# Ways to monitize

- pay $5
- pay what you wish
- buy / generate art from cooks


# Charting libs

- https://github.com/yaronn/blessed-contrib
- https://vega.github.io/vega/
- https://github.com/vega/vega-embed
- https://altair-viz.github.io/ (python)
- https://github.com/yhat/ggpy (python)



- https://formidable.com/open-source/victory/docs/
- https://vx-demo.now.sh/
- https://recharts.org/en-US/


# Databases

- https://github.com/louischatriot/nedb
- Airtable


# Testing

- Great article simple steps: https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6




-------

GET /cook
// returns all cooks 



## OLD database notes

- `brew install rethinkdb`
- `rethinkdb`
- in browser go to http://localhost:8080/

https://marmelab.com/blog/2019/09/25/couchdb_pouchdb_serious_firebase_alternative.html


Good article on optimization
https://www.mongodb.com/blog/post/time-series-data-and-mongodb-part-2-schema-design-best-practices


Filtering changes
https://pouchdb.com/api.html#filtered-changes


Better doc IDS that have our sensor prop names in them?
https://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html