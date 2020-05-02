String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

export const COMMANDS = Object.freeze({
  powerOn: "UK001!",
  powerOnColdSmoke: "UK002!",
  powerOff: "UK004!",
  getGrillStatus: "UR001!",
  getGrillId: "UL!",
  setGrillTempF: (temp) => `UT${temp}!`,
  setProbe1TempF: (temp) => `UF${temp}!`,
  setProbe2TempF: (temp) => `Uf${temp}!`,
  // setPizzaMode: 'UC.+ 2    !',
  // setRegularMode: 'UC.+ 9    !'
});

export const HEX_COMMANDS = Object.freeze({
  setPizzaMode: (settings) => {
    const mode = `55430${settings.replaceAt(1, "2")}21`;
    return mode;
  },
  setRegularMode: (settings) => {
    const mode = `55430${settings.replaceAt(1, "0")}21`;
    return mode;
  },
});
