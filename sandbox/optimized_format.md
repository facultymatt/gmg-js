```json
{
  "_id": "1586219788798",
  "_rev": "1-92dfdedae451ec6f7882a88372dd2fa5",
  "timestamp": 1586219788798,
  "state": "off",
  "hex": "555239003c009600010b1432191919193c000000ffffffff000000000000000001000103",
  "isOn": false,
  "grill": 57,
  "grillTarget": 0,
  "probe1": 60,
  "probe1Target": 0,
  "probe2": 60,
  "probe2Target": 0,
  "fanMode": false,
  "lowPellet": false,
  "test_16": 2817,
  "test_20": 12820,
  "test_24": 6425,
  "test_28": 6425,
  "test_40": 65535,
  "test_44": 65535,
  "test_52": 0,
  "test_64": 1,
  "test_68": 769
}
```

the above has smaller keys but is still not optimized for getting the smallest number of docs to populate ui. 

One step is to turn some of these into events. First we store grillState into memory

```js 

rxjs behaviorSubject 'grillStatus'

// * created every internal X and pruned every interval Y
//   for example create every second, prune every 3 days with cron.
// * when a cook is created, the associated events are stored into the
//   cook document. Thus they can be deleted from here
{
  "t": 1586219788798,
  "hex": "555239003c009600010b1432191919193c000000ffffffff000000000000000001000103",
  "s": "off",
  "pA": false,
  "gC": 57,
  "gT": 0,
  "p1C": 60,
  "p1T": 0,
  "p2C": 60,
  "p2T": 0,
  "d16": 2817,
  "d20": 12820,
  "d24": 6425,
  "d28": 6425,
  "d40": 65535,
  "d44": 65535,
  "d52": 0,
  "d64": 1,
  "d68": 769
}

```

Could be simplied or expanded. Point is this is used on each record to see if state has changed. If app is powered down, should we (can we) store last state into database?


```js
database 'powerStatus'

[
  {
    // @TODO look into using collated id like [timestamp, type].join('-')
    _id: new Date(timestamp).toJSON(),
    type: "ON"
  },
  {
    _id: new Date(timestamp).toJSON(),
    type: "FAN"
  },
  {
    _id: new Date(timestamp).toJSON(),
    type: "OFF"
  }
]
```

These events are simple and allow us to render icons in the UI for each time. We COULD render rectangles or duration events by looking at an event like ON, and drawing a rectangle until FAN event. This could be simplified in the UI by making the server more complex:  

```js
database 'powerStatus'

[
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    end: timestamp,
    type: "ON"
  },
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    end: timestamp,
    type: "FAN"
  },
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    type: "OFF"
  }
]
```

In this design the server would need to know whether to create a new event, or update the current. Note that updates will get revisions, so we don't want to update if not needed. Carefully consider if needed in UI before implementing this. 


```js
database 'lowPelletAlarm'

[
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    end: timestamp,
    type: "LOW_PELLET_ALARM"
  }
]

// here is how we could create a duration event. First make an event when pellet alarm turns on

[
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    end: undefined,
    type: "LOW_PELLET_ALARM"
  }
]

// on each message from grill, check current grill status: if pellet alarm has changed
// then update the event. In UI, events with undefined end, will use time.now for end.

[
  {
    _id: new Date(timestamp).toJSON(),
    start: timestamp,
    end: timestamp,
    type: "LOW_PELLET_ALARM"
  }
]

```

Notice the start time is required, and end is optional. Some events will have an end, which will be set by app using the following logic

- on each new state (message from gril in response to getGrillStatus command)
 - get previous state (could be stored in memory or in database)
   - if prop `x` has changed, PUT event 

