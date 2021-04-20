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
wantedEntriesPerSecond = 30
portionToExport = 10 # in %
startFromSec = 0

getEPS = int( entriesPerSecond / wantedEntriesPerSecond )

f = open('log.json',)
data = json.load(f)

totalLength = len(data)
exportCount = totalLength*(portionToExport/100)
startCount = startFromSec 

print(bcolors.OKBLUE+"Total entry count: "+str(totalLength))
print("Portion to export: "+str( portionToExport )+"%")
print("Entry count to export: "+str( exportCount )+bcolors.ENDC)

# CREATE JSON ARRAYS ---------------------------------------------------------

accArr = []

initialTS = 0

# PARSE THOUGH JSON ---------------------------------------------------------
for i, entry in enumerate(data):

  loggingTime = entry["loggingTime"]
  # loggingSample = int( entry["logSampleNr"] )

  # 2021-04-09 12:31:12.114 +0200
  ts = datetime.strptime(
      loggingTime[:-6],"%Y-%m-%d %H:%M:%S.%f"
    )#.timetuple())
  
  ts = time.mktime(ts.timetuple()) + (ts.microsecond / 1000000.0)

  # print( ts )

  if i == 0 :

    initialTS = ts

  # convert timestamp  from usage
  ts = (ts - initialTS)

  print(ts)

  # only get every 30th value
  if i%getEPS == 0 and i < exportCount and ts >= startFromSec :

    # accelerometer
    # accTS = float( entry["accelerometerTimestamp_sinceReboot"] )-accInitTS
    accData = {
      "ts":ts,
      # "x":float( entry["accelerometerAccelerationX"] ),
      # "y":float( entry["accelerometerAccelerationY"] ),
      # "z":float( entry["accelerometerAccelerationZ"] ),
      "quatW":float( entry["motionQuaternionW"] ),
      "quatX":float( entry["motionQuaternionX"] ),
      "quatY":float( entry["motionQuaternionY"] ),
      "quatZ":float( entry["motionQuaternionZ"] )
    }
    accArr.append(accData)

    # motion
    # motionData = {
    #   "ts":ts,
    #   "x":float( entry["motionGravityX"] ),
    #   "y":float( entry["motionGravityY"] ),
    #   "z":float( entry["motionGravityZ"] ),
    #   "heading":float( entry["motionHeading"] ),
    #   "magFieldX":float( entry["motionMagneticFieldX"] ),
    #   "magFieldY":float( entry["motionMagneticFieldY"] ),
    #   "magFieldZ":float( entry["motionMagneticFieldZ"] ),
    #   # "motionPitch" : "0.455874",
    #   # "motionQuaternionW" : "0.955005",
    #   # "motionQuaternionX" : "0.229547",
    #   # "motionQuaternionY" : "0.004821",
    #   # "motionQuaternionZ" : "0.187752",
    #   # "motionRoll" : "-0.085850",
    #   # "motionRotationRateX" : "-0.112700",
    #   # "motionRotationRateY" : "-0.179058",
    #   # "motionRotationRateZ" : "0.055314",
    #   # "motionTimestamp_sinceReboot" : "174394.649834",
    #   # "motionUserAccelerationX" : "0.084892",
    #   # "motionUserAccelerationY" : "-0.079117",
    #   # "motionUserAccelerationZ" : "-0.026695",
    #   # "motionYaw" : "0.408170",
    # }
    # motionArr.append(motionData)

    # pedometer
    # pedometerData = {
    #   "ts":ts,
    #   "avgPace":float( entry["pedometerAverageActivePace"] ),
    #   "cadence":float( entry["pedometerCurrentCadence"] ),
    #   "pace":float( entry["pedometerCurrentPace"] ),
    #   "dist":float( entry["pedometerDistance"] ),
    #   "floorsAsc":float( entry["pedometerFloorsAscended"] ),
    #   "floorsDesc":float( entry["pedometerFloorsDescended"] ),
    #   "steps":float( entry["pedometerNumberOfSteps"] ),
    #   # "pedometerEndDate" : "null",
    #   # "pedometerStartDate" : "null"
    # }
    # pedometerArr.append(pedometerData)


f.close()

print(bcolors.OKBLUE+"Final entry count: "+str(len(accArr))+bcolors.ENDC)


# CREATE JSON FILES ---------------------------------------------------------
# exportFolder = "export/" # within
exportFolder = "../components/PhoneObj/" # to use

# accelerometer
accJSONString = json.dumps(accArr)
accJSONFile = open(exportFolder+"iPhoneMovement.json", "w")
accJSONFile.write(accJSONString)
accJSONFile.close()


print(bcolors.OKGREEN + 'JSON convert done ✔' + bcolors.ENDC)
