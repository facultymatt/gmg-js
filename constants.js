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
  powerOnColdSmoke: "UK002!",
  powerOff: "UK004!",
  getGrillStatus: "UR001!",
  getGrillId: "UL!",
  setGrillTempF: (temp) => `UT${temp}!`,
  setFoodTempF: (temp) => `UF${temp}!`,
  // setPizzaMode: 'UC.+ 2    !',
  // setRegularMode: 'UC.+ 9    !'
});

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

export const HEX_COMMANDS = Object.freeze({
  setPizzaMode: (settings) => {
    const mode = `55430${settings.replaceAt(7, '2')}21`;
    console.log(settings, mode);
    return '5543052b02191919191921';
  },
  setRegularMode: (settings) => {
    const mode = `55430${settings.replaceAt(7, '0')}21`;
    console.log(settings, mode);
    return '5543050b02191919191921';
    // return '50b023219191919'
  },
});

// UN - what does this do?
// UF150
// Uf150


// used to work
// 5543052b023220202020
// 52b14321919191921