const getRawValue = (hex, position) => {
  const value = hex.substr(position, 2)
  const parsed = parseInt(value, 16)
  return parsed
}

const getGrillState = (hex) => {
  const statusCharacter = hex.charAt(61)
  let status = parseInt(statusCharacter, 10)
  if (status === 0) status = 'off'
  else if (status === 1) status = 'on'
  else if (status === 2) status = 'fan mode'
  else status = 'unknown'
  return status
}

// @todo test and refactor
const getCurrentGrillTemp = (hex) => {
  const first = getRawValue(hex, 4)
  const second = getRawValue(hex, 6)
  return first + (second * 256)
}

const getLowPelletAlarmActive = (hex) => {
  const first = getRawValue(hex, 48)
  const second = getRawValue(hex, 50)
  const value = first + (second * 256)
  return value === 128
}

// 12 on chart, next is 16
const getDesiredGrillTemp = (hex) => {
  const first = getRawValue(hex, 12)
  const second = getRawValue(hex, 14)
  return first + (second * 256)
}

const getCurrentFoodTemp = (hex) => {
  const first = getRawValue(hex, 8)
  const second = getRawValue(hex, 10)
  const currentFoodTemp = first + (second * 256)
  return currentFoodTemp >= 557 ? 0 : currentFoodTemp
}

const test = (hex, start) => {
  const first = getRawValue(hex, start)
  const second = getRawValue(hex, start + 2)
  return first + (second * 256)
}


const getDesiredFoodTemp = (hex) => {
  const first = getRawValue(hex, 56)
  const second = getRawValue(hex, 58)
  return first + (second * 256)
}

class GrillStatus {
  constructor(bytes) {
    const hex = Buffer.from(bytes).toString('hex')
    this.state = getGrillState(hex)
    this._hex = hex
    this.isOn = this.state === 'on'
    this.currentGrillTemp = getCurrentGrillTemp(hex)
    this.desiredGrillTemp = this.isOn ? getDesiredGrillTemp(hex) : 0
    this.currentProbe1Temp = getCurrentFoodTemp(hex)
    this.desiredProbe1Temp = this.isOn ? getDesiredFoodTemp(hex) : 0;
    this.currentProbe2Temp = test(hex, 32);
    this.desiredProbe2Temp = test(hex, 36);

    this.fanModeActive = this.state === 'fan mode'
    this.lowPelletAlarmActive = getLowPelletAlarmActive(hex)

    this.test_16 = test(hex, 16);
    this.test_20 = test(hex, 20);
    this.test_24 = test(hex, 24);
    this.test_28 = test(hex, 28);
    // this.test_32 = test(hex, 32); // _C2T = Current Food probe 2 temp
    // this.test_36 = test(hex, 36); // _D2T = Desired Food probe 2 temp
    this.test_40 = test(hex, 40);
    this.test_44 = test(hex, 44);
    this.test_52 = test(hex, 52);
    this.test_64 = test(hex, 64);
    this.test_68 = test(hex, 68);
  }
}

module.exports = GrillStatus