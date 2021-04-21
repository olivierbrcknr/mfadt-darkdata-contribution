import json
import time
from datetime import datetime, timedelta, tzinfo

class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKCYAN = '\033[96m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'

print(bcolors.OKGREEN + 'Start JSON convert' + bcolors.ENDC)

entriesPerSecond = 30 # 30 Hz
wantedEntriesPerSecond = 1
portionToExport = 50 # in %

getEPS = int( entriesPerSecond / wantedEntriesPerSecond )

f = open('log.json',)
data = json.load(f)

totalLength = len(data)
exportCount = totalLength*(portionToExport/100)

print(bcolors.OKBLUE+"Total entry count: "+str(totalLength))
print("Portion to export: "+str( portionToExport )+"%")
print("Entry count to export: "+str( exportCount )+bcolors.ENDC)

# CREATE JSON ARRAYS ---------------------------------------------------------

accArr = []
accInitTS = 0
activityArr = []
altimeterArr = []
avAudioArr = []
batteryArr = []
orientationArr = []
gyroArr = []
locationArr = []
magnetArr = []
motionArr = []
pedometerArr = []

initialTS = 0

# PARSE THOUGH JSON ---------------------------------------------------------
for i, entry in enumerate(data):

  loggingTime = entry["loggingTime"]
  # loggingSample = int( entry["logSampleNr"] )

  # 2021-04-09 12:31:12.114 +0200
  ts = time.mktime(
    datetime.strptime(
      loggingTime[:-6],"%Y-%m-%d %H:%M:%S.%f"
    ).timetuple())

  if i == 0 :

    initialTS = ts

  #   accInitTS = float( entry["accelerometerTimestamp_sinceReboot"] )
  #   gyroInitTS = float( entry["gyroTimestamp_sinceReboot"] )

  # convert timestamp into minutes from usage
  ts = (ts - initialTS) / 60 

  ts = int( ts * 100 ) / 100

  # only get every 30th value
  if i%getEPS == 0 and i < exportCount :

    # accelerometer
    # accTS = float( entry["accelerometerTimestamp_sinceReboot"] )-accInitTS
    accData = {
      "ts":ts,
      "x":float( entry["accelerometerAccelerationX"] ),
      "y":float( entry["accelerometerAccelerationY"] ),
      "z":float( entry["accelerometerAccelerationZ"] )
    }
    accArr.append(accData)

    # activity
    activityData = {
      "ts":ts,
      "type":entry["activity"],
      "confidence":int(entry["activityActivityConfidence"]),
      # "date":entry["activityActivityStartDate"],
      # "ts":float(entry["activityTimestamp_sinceReboot"])
    }
    activityArr.append(activityData)

    #altimeter
    altimeterData = {
      "ts":ts,
      "pressure":float(entry["altimeterPressure"]),
      "relative":float(entry["altimeterRelativeAltitude"]),
      "reset":float(entry["altimeterReset"]),
      # "ts":float(entry["altimeterTimestamp_sinceReboot"]),
    }
    altimeterArr.append(altimeterData)

    # av Audio Recorder
    audioData = {
      "ts":ts,
      # "ts":float(entry["avAudioRecorder_Timestamp_since1970"]),
      "avgP":float(entry["avAudioRecorderAveragePower"]),
      "peakP":float(entry["avAudioRecorderPeakPower"]),
    }
    avAudioArr.append(audioData)

    # battery
    batteryData = {
      "ts":ts,
      "level":float(entry["batteryLevel"]),
      "state":float(entry["batteryState"]),
      # "ts70":entry["batteryTimeStamp_since1970"]
    }
    batteryArr.append(batteryData)

    # orientation
    orientationData = {
      "ts":ts,
      "orientation":int(entry["deviceOrientation"])
      # "deviceOrientation" : "1",
      # "deviceOrientationTimeStamp_since1970" : "0.000000",
    }
    orientationArr.append(orientationData)

    # gyro
    # gyroTS = float( entry["gyroTimestamp_sinceReboot"] ) - gyroInitTS
    gyroData = {
      "ts":ts,
      # "ts":gyroTS,
      "x":float( entry["gyroRotationX"] ),
      "y":float( entry["gyroRotationY"] ),
      "z":float( entry["gyroRotationZ"] )
    }
    gyroArr.append(gyroData)

    # location
    locationData = {
      "ts":ts,
      # "lat":float( entry["locationLatitude"] ),
      # "lng":float( entry["locationLongitude"] ),
      "altitude":float( entry["locationAltitude"] ),
      # "floor":float( entry["locationFloor"] ),
      # "headX":float( entry["locationHeadingX"] ),
      # "headY":float( entry["locationHeadingY"] ),
      # "headZ":float( entry["locationHeadingZ"] ),
      "speed":float( entry["locationSpeed"] ),
      "course":float( entry["locationCourse"] ),

      # "locationHeadingTimestamp_since1970" : "1617964272.094853",
      # "locationHorizontalAccuracy" : "18.383077",
      # "locationTimestamp_since1970" : "1617964271.999422",
      # "locationVerticalAccuracy" : "3.965190",
    }
    locationArr.append(locationData)

    # magnet
    magnetData = {
      "ts":ts,
      "x":float( entry["magnetometerX"] ),
      "y":float( entry["magnetometerY"] ),
      "z":float( entry["magnetometerZ"] ),
      "magHead":float( entry["locationMagneticHeading"] ),
      "trueHead":float( entry["locationTrueHeading"] ),
      "headAcc":float( entry["locationHeadingAccuracy"] ),

    }
    magnetArr.append(magnetData)

    # motion
    motionData = {
      "ts":ts,
      "x":float( entry["motionGravityX"] ),
      "y":float( entry["motionGravityY"] ),
      "z":float( entry["motionGravityZ"] ),
      "heading":float( entry["motionHeading"] ),
      "magFieldX":float( entry["motionMagneticFieldX"] ),
      "magFieldY":float( entry["motionMagneticFieldY"] ),
      "magFieldZ":float( entry["motionMagneticFieldZ"] ),
      # "motionPitch" : "0.455874",
      # "motionQuaternionW" : "0.955005",
      # "motionQuaternionX" : "0.229547",
      # "motionQuaternionY" : "0.004821",
      # "motionQuaternionZ" : "0.187752",
      # "motionRoll" : "-0.085850",
      # "motionRotationRateX" : "-0.112700",
      # "motionRotationRateY" : "-0.179058",
      # "motionRotationRateZ" : "0.055314",
      # "motionTimestamp_sinceReboot" : "174394.649834",
      # "motionUserAccelerationX" : "0.084892",
      # "motionUserAccelerationY" : "-0.079117",
      # "motionUserAccelerationZ" : "-0.026695",
      # "motionYaw" : "0.408170",
    }
    motionArr.append(motionData)

    # pedometer
    pedometerData = {
      "ts":ts,
      "avgPace":float( entry["pedometerAverageActivePace"] ),
      "cadence":float( entry["pedometerCurrentCadence"] ),
      "pace":float( entry["pedometerCurrentPace"] ),
      "dist":float( entry["pedometerDistance"] ),
      "floorsAsc":float( entry["pedometerFloorsAscended"] ),
      "floorsDesc":float( entry["pedometerFloorsDescended"] ),
      "steps":float( entry["pedometerNumberOfSteps"] ),
      # "pedometerEndDate" : "null",
      # "pedometerStartDate" : "null"
    }
    pedometerArr.append(pedometerData)


f.close()

print(bcolors.OKBLUE+"Final entry count: "+str(len(accArr))+bcolors.ENDC)


# CREATE JSON FILES ---------------------------------------------------------
# exportFolder = "export/" # within
exportFolder = "../components/Data/logs/" # to use

# accelerometer
accJSONString = json.dumps(accArr)
accJSONFile = open(exportFolder+"accelerometer.json", "w")
accJSONFile.write(accJSONString)
accJSONFile.close()

# activity
activityJSONString = json.dumps(activityArr)
activityJSONFile = open(exportFolder+"activity.json", "w")
activityJSONFile.write(activityJSONString)
activityJSONFile.close()

# altimeter
altimeterJSONString = json.dumps(altimeterArr)
altimeterJSONFile = open(exportFolder+"altimeter.json", "w")
altimeterJSONFile.write(altimeterJSONString)
altimeterJSONFile.close()

# av Audio Recorder
audioJSONString = json.dumps(avAudioArr)
audioJSONFile = open(exportFolder+"audio.json", "w")
audioJSONFile.write(audioJSONString)
audioJSONFile.close()

# battery
batteryJSONString = json.dumps(batteryArr)
batteryJSONFile = open(exportFolder+"battery.json", "w")
batteryJSONFile.write(batteryJSONString)
batteryJSONFile.close()

# orientation
orientationJSONString = json.dumps(orientationArr)
orientationJSONFile = open(exportFolder+"orientation.json", "w")
orientationJSONFile.write(orientationJSONString)
orientationJSONFile.close()

# gyro
gyroJSONString = json.dumps(gyroArr)
gyroJSONFile = open(exportFolder+"gyro.json", "w")
gyroJSONFile.write(gyroJSONString)
gyroJSONFile.close()

# location
locationJSONString = json.dumps(locationArr)
locationJSONFile = open(exportFolder+"location.json", "w")
locationJSONFile.write(locationJSONString)
locationJSONFile.close()

# magnet
magnetJSONString = json.dumps(magnetArr)
magnetJSONFile = open(exportFolder+"magnet.json", "w")
magnetJSONFile.write(magnetJSONString)
magnetJSONFile.close()

# motion
motionJSONString = json.dumps(motionArr)
motionJSONFile = open(exportFolder+"motion.json", "w")
motionJSONFile.write(motionJSONString)
motionJSONFile.close()

# pedometer
pedometerJSONString = json.dumps(pedometerArr)
pedometerJSONFile = open(exportFolder+"pedometer.json", "w")
pedometerJSONFile.write(pedometerJSONString)
pedometerJSONFile.close()

print(bcolors.OKGREEN + 'JSON convert done ✔' + bcolors.ENDC)
