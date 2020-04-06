export const HEADERS = [
  "timestamp",
  "state",
  "isOn",
  "currentGrillTemp",
  "desiredGrillTemp",
  "currentProbe1Temp",
  "desiredProbe1Temp",
  "currentProbe2Temp",
  "desiredProbe2Temp",
  "fanModeActive",
  "lowPelletAlarmActive",
];

export const COMMANDS = Object.freeze({
  powerOn: "UK001!",
  // powerOff: 'UK004!',
  getGrillStatus: "UR001!",
  getGrillId: "UL!",
  // setGrillTempF: (temp) => `UT${temp}!`,
  setFoodTempF: (temp) => `UF${temp}!`,
});
