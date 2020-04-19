## TODO update with latest

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

