input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    basic.showString(kitronik_smart_greenhouse.readTime())
})
// Për të treguar temperaturën dhe lagështirën
input.onButtonPressed(Button.A, function () {
    basic.showNumber(kitronik_smart_greenhouse.temperature(TemperatureUnitList.C))
})
// Për ujitje të vazhdueshme
kitronik_smart_greenhouse.onAlarmTrigger(function () {
    if (alarmH == 23) {
        alarmH = 0
    } else {
        alarmH += 1
    }
    kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, alarmH, alarmM, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
})
// Për te ujitur automatikisht sipas orarit ose kur bima ka nevojë për ujë
function ujtije () {
    for (let index = 0; index < 5; index++) {
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
        basic.pause(1000)
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
        basic.pause(2000)
    }
}
input.onButtonPressed(Button.AB, function () {
    basic.showNumber(kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1))
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(kitronik_smart_greenhouse.humidity())
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (!(bosh)) {
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(true))
        basic.pause(2000)
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
    }
})
let humidity = 0
let temp = 0
let soil = 0
let bosh = false
let alarmM = 0
let alarmH = 0
kitronik_smart_greenhouse.setTime(14, 0, 0)
kitronik_smart_greenhouse.setDate(20, 1, 2025)
kitronik_smart_greenhouse.setBuzzerPin()
let zipLEDs = kitronik_smart_greenhouse.createGreenhouseZIPDisplay(8)
let statusLEDs = zipLEDs.statusLedsRange()
alarmH = 14
alarmM = 10
kitronik_smart_greenhouse.simpleAlarmSet(kitronik_smart_greenhouse.AlarmType.Single, alarmH, alarmM, kitronik_smart_greenhouse.AlarmSilence.autoSilence)
basic.forever(function () {
    soil = Math.map(kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1), 0, 1023, 35, 150)
    statusLEDs.setZipLedColor(2, kitronik_smart_greenhouse.hueToRGB(soil))
    statusLEDs.show()
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p1) <= 400 || kitronik_smart_greenhouse.simpleAlarmCheck()) {
        ujtije()
    }
    basic.pause(10000)
})
// Për te treguar nivelin e lageshtirës dhe temperaturën
basic.forever(function () {
    temp = Math.map(kitronik_smart_greenhouse.temperature(TemperatureUnitList.C), 0, 40, 210, 0)
    humidity = Math.map(kitronik_smart_greenhouse.humidity(), 0, 100, 35, 150)
    statusLEDs.setZipLedColor(0, kitronik_smart_greenhouse.hueToRGB(temp))
    statusLEDs.setZipLedColor(1, kitronik_smart_greenhouse.hueToRGB(humidity))
    statusLEDs.show()
})
// Nëse nuk ka mjaftuheshëm ujë, pompa mbyllet
basic.forever(function () {
    if (kitronik_smart_greenhouse.readIOPin(kitronik_smart_greenhouse.PinType.analog, kitronik_smart_greenhouse.IOPins.p0) < 300) {
        kitronik_smart_greenhouse.controlHighPowerPin(kitronik_smart_greenhouse.HighPowerPins.pin13, kitronik_smart_greenhouse.onOff(false))
        bosh = true
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        basic.pause(1000)
    } else {
        bosh = false
    }
})
