const getRawValue = (hex, position) => {
  const value = hex.substr(position, 2);
  const parsed = parseInt(value, 16);
  return parsed;
};

const getGrillState = (hex) => {
  const statusCharacter = hex.charAt(61);
  let status = parseInt(statusCharacter, 10);
  if (status === 0) status = "off";
  else if (status === 1) status = "on";
  else if (status === 2) status = "fan mode";
  else if (status === 3) status = "cold smoke mode";
  else status = "unknown";
  return status;
};

// @todo test and refactor
const getCurrentGrillTemp = (hex) => {
  const first = getRawValue(hex, 4);
  const second = getRawValue(hex, 6);
  return first + second * 256;
};

const getLowPelletAlarmActive = (hex) => {
  const first = getRawValue(hex, 48);
  const second = getRawValue(hex, 50);
  const value = first + second * 256;
  return value === 128;
};

// 12 on chart, next is 16
const getDesiredGrillTemp = (hex) => {
  const first = getRawValue(hex, 12);
  const second = getRawValue(hex, 14);
  return first + second * 256;
};

const getCurrentFoodTemp = (hex) => {
  const first = getRawValue(hex, 8);
  const second = getRawValue(hex, 10);
  const currentFoodTemp = first + second * 256;
  return currentFoodTemp >= 557 ? 0 : currentFoodTemp;
};

const test = (hex, start) => {
  const first = getRawValue(hex, start);
  const second = getRawValue(hex, start + 2);
  return first + second * 256;
};

const testPizzaMode = (hex, start) => {
  return parseInt(hex.charAt(start + 2), 10) === 2 ? "pizza" : "regular";
};

const getDesiredFoodTemp = (hex) => {
  const first = getRawValue(hex, 56);
  const second = getRawValue(hex, 58);
  return first + second * 256;
};

const parseHex = (str) => {
  return parseInt(str, 16);
};

const someMap = {
  0: "Climate ICY",
  4: "Climate COLD",
  8: "Climate AVERAGE",
  12: "Climate WARM",
  1: "Climate HOT",
  10: "Lock temp display OFF",
  9: "Auto Revert Wifi OFF",
  11: "Auto Revert Wifi ON",
};

class GrillStatus {
  constructor(bytes) {
    const hex = Buffer.from(bytes).toString("hex");
    this.state = getGrillState(hex);
    this.settings = hex.substring(17, 32);
    this.grillOptions = {
      who: this.settings.substring(0, 1),
      pizzaMode: this.settings.substring(1, 2) === "2",
      manySettingsValue: parseHex(this.settings.substring(2, 3)),
      lastManySettings: someMap[parseHex(this.settings.substring(2, 3))],
      grillAdjustA: parseHex(this.settings.substring(3, 5)), // -20 to 20 range
      grillAdjustB: parseHex(this.settings.substring(5, 7)),
      probe1AdjustA: parseHex(this.settings.substring(7, 9)), // -25 to 25 deg range
      probe1AdjustB: parseHex(this.settings.substring(9, 11)),
      probe2AdjustA: parseHex(this.settings.substring(11, 13)),
      probe2AdjustB: parseHex(this.settings.substring(13, 15)),
    };
    // strange edge case
    if (
      this.settings.substring(1, 2) !== "0" &&
      parseHex(this.settings.substring(2, 3)) === 0
    ) {
      this.grillOptions.pizzaMode = false;
      this.grillOptions.lastManySettings = someMap[1];
    }
    this.hex = hex;
    this.isOn = this.state === "on" || this.state === "cold smoke mode";
    this.currentGrillTemp = getCurrentGrillTemp(hex);
    this.desiredGrillTemp = this.isOn ? getDesiredGrillTemp(hex) : 0;
    this.currentProbe1Temp = getCurrentFoodTemp(hex);
    this.desiredProbe1Temp = this.isOn ? getDesiredFoodTemp(hex) : 0;
    this.currentProbe2Temp = test(hex, 32);
    this.desiredProbe2Temp = test(hex, 36);

    this.fanModeActive = this.state === "fan mode";
    this.lowPelletAlarmActive = getLowPelletAlarmActive(hex);

    // maybe correlates to pizza mode?
    this.test_16 = test(hex, 16);
    this.test_16_pizza = testPizzaMode(hex, 16);

    this.test_20 = test(hex, 20);
    this.test_24 = test(hex, 24);
    this.test_28 = test(hex, 28);
    // this.test_32 = test(hex, 32); // _C2T = Current Food probe 2 temp
    // this.test_36 = test(hex, 36); // _D2T = Desired Food probe 2 temp
    this.test_40 = test(hex, 40);
    this.test_44 = test(hex, 44);
    this.test_52 = test(hex, 52);

    // maybe correlates to mode?
    // 174 == cold smoke, 6402 == grill, 19204 === fan mode?
    // 4 == fan mode almost done
    // 1 === off?
    this.test_64 = test(hex, 64);

    this.test_68 = test(hex, 68);
  }
}

module.exports = GrillStatus;
