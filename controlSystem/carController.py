import zmq
import json
import numpy as np
import time
import keyboard
from simple_pid import PID
import helper

class ManualControls:
    def __init__(self):
        self.throttle = 0
        self.brakes = 0
        self.steering = 0
        self.reset = False
        self.gear = 0

class CarController:
    def __init__(self, car_port):
        # ZeroMQ setup
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REQ)
        self.socket.connect(f"tcp://localhost:{car_port}") #192.168.10.25
        self.carData = None
        self.carCommand = None
        self.steeringPid = PID(Kp=10, Ki=0.5, Kd=10, setpoint=0)
        self.speedPid = PID(Kp=0.01, Ki=0.05, Kd=0.1, setpoint=20)
        self.speedPid.output_limits = (-100, 100)
        self.command = {}
        self.command["Throttle"] = 0
        self.command["Brakes"] = 0
        self.command["SteeringWheel"] = 0
        self.command["Gear"] = 0
        self.logFile = open("log.csv", "w")
        self.logFile.write("Timestamp;Speed;DistanceFromCenter;TrackAngle;TrackDistance;WorldPosition;WorldRotation;Throttle;Brakes;Steering;Gear\n")
        self.manualControls = ManualControls()
        self.firstRound = True
        
    
    def send_command(self, throttle, brakes, steering, reset):
        self.carCommand = {
            "Throttle": throttle,
            "Brakes": brakes,
            "SteeringWheel": steering
        }
        
        message = json.dumps(self.carCommand).encode()
        self.socket.send(message)
    
    def receive_data(self):
        event = self.socket.poll(timeout=3000)  # wait 3 seconds
        if event == 0:
            # timeout reached before any events were queued
            pass
        else:
            # events queued within our time limit
            msg = self.socket.recv()
            self.carData = json.loads(msg)
            
    def piecewise_linear_interpolation(self,distance, d_start, d_middle, d_end, v_min, v_max, v_end, offset):
        if distance <= d_start:
            return offset
        elif d_start < distance <= d_middle:
            # Hochinterpolation zwischen d_start und d_middle
            return v_min + (v_max - v_min) * (distance - d_start) / (d_middle - d_start)
        elif d_middle < distance <= d_end:
            # Runterinterpolation zwischen d_middle und d_end
            return v_max - (v_max - v_end) * (distance - d_middle) / (d_end - d_middle)
        else:
            return offset


    def compute_control(self):
        # Extract necessary car data
        speed = self.carData["CurrentSpeed"]
        distance_from_center = self.carData['TrackInfo']["DistanceToMiddle"]
        track_angle = self.carData["TrackInfo"]["AngleToMiddle"]
        k1 = 0.8
        k2 = 0.30
        # Adjust steering
        offset = 0
        if speed > 20:
            offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 20, 40, 60, 15, 5, -25, offset) #Kurve 0
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 220, 290, 346, 0, 8, -22, offset) #Kurve 1
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 390, 421, 466, 5, 7, -5, offset) #Kurve 2
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 840, 877, 906, 0, 8, -25, offset) #Kurve 3
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 960, 1040, 1100, 5, 5, -15, offset) #Kurve 4
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1166, 1214, 1220, -15, 10, 15, offset) #Kurve 5
        # offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1221, 1240, 1272, 15, 0, 0, offset) #Kurve 6
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1273, 1360, 1429, 5, 5, 5, offset) #Kurve 7
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1430, 1431, 1478, 5, -5, -10, offset) #Kurve 8
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1500, 1592, 1627, 3, -3, 5, offset) #Kurve 8.1
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1677, 1707, 1732, -3, 5, 0, offset) #Kurve 9
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1733, 1765, 1788, 0, -5, -15, offset) #Kurve 10
        offset = self.piecewise_linear_interpolation(self.carData["TrackInfo"]["TrackDistance"], 1805, 1837, 1905, 0, -5, 5, offset) #Kurve 11
        
        #- nach links, + nach rechts
        # print("Offset:", offset)
        steering = self.steeringPid(k1*(distance_from_center + offset)+ k2*track_angle)
        steering = self.limitValue(steering, -100, 100)
        
        throttle, brakes = self.controlSpeed()
        # Adjust gear dynamically
            
        reset = "False"
        
        throttle = int(throttle)
        self.command["Throttle"] = throttle
        brakes = int(brakes)
        self.command["Brakes"] = brakes
        steering = int(steering)
        self.command["SteeringWheel"] = steering
        # print(throttle, brakes, steering, reset, speed)
        return throttle, brakes, steering, reset

            
    def limitValue(self, value, min, max):
        if value < min:
            return min
        elif value > max:
            return max
        else:
            return value
            
    def controlSpeed(self):
        #get the current TrackDistance and read the value from the setPointData, use Throttle and Brakes from the setPointData
        currentTrackDistance = self.carData["TrackInfo"]["TrackDistance"]
        
        scalingFactorAccelerate = 1.0
        scalingFactorBrake = 1.0
        
        intCurrentTrackDistance = int(float(currentTrackDistance))
        try:
            setPoint = self.setPointData[intCurrentTrackDistance]
        except KeyError:
            setPoint = self.setPointData[intCurrentTrackDistance - 1]
        throttle = int(setPoint["Throttle"])*scalingFactorAccelerate
        brakes = int(setPoint["Brakes"])*(1-scalingFactorBrake)
        print("Throttle:", int(throttle), "Brakes:", int(brakes), "Current Position:", intCurrentTrackDistance, "Gear:", self.carData["CurrentGear"], "Speed:", int(self.carData["CurrentSpeed"]),"TireWear:", self.carData["CarInfo"]["TireWear"], "BrakeWear:", self.carData["CarInfo"]["BrakeWear"])
        return throttle, brakes
        
    def gearShifter(self):
        speed = self.carData["CurrentSpeed"]
        current_gear = self.carData["CurrentGear"]

        shift_mapping = [ 
                         (0, 7), 
                         (4, 14), 
                         (10, 24), #gear 3
                         (20, 30), #gear 4
                         (25, 40), 
                         (80, np.inf) 
                         ]
        
        downshift_speed, upshift_speed = shift_mapping[current_gear - 1]
        
        if speed > upshift_speed and current_gear < len(shift_mapping):
            desired_gear = current_gear + 1
        elif speed < downshift_speed and current_gear > 1:
            desired_gear = current_gear - 1
        else:
            desired_gear = current_gear

        if current_gear == 0:
            desired_gear = 1
            
        while current_gear != desired_gear:
            if self.carData["CarInfo"]["BrokenShifter"]:
                break
            
            if current_gear < desired_gear:
                self.socket.send(b'{"GearSelection": "up"}')
            elif current_gear > desired_gear:
                self.socket.send(b'{"GearSelection": "down"}')
            self.receive_data()
            current_gear = self.carData["CurrentGear"]
    
    def recordRunToFile(self):
        # Extract necessary car data
        speed = self.carData["CurrentSpeed"]
        distance_from_center = self.carData['TrackInfo']["DistanceToMiddle"]
        track_angle = self.carData["TrackInfo"]["AngleToMiddle"]
        track_distance = self.carData["TrackInfo"]["TrackDistance"]
        world_position = self.carData["TrackInfo"]["WorldPosition"]
        world_rotation = self.carData["TrackInfo"]["WorldRotation"]
        throttle = self.carCommand["Throttle"]
        brakes = self.carCommand["Brakes"]
        steering = self.carCommand["SteeringWheel"]
        gear = self.carData["CurrentGear"]
        #log to csv file
        self.logFile.write(f"{time.time()};{speed};{distance_from_center};{track_angle};{track_distance};{world_position};{world_rotation};{throttle};{brakes};{steering};{gear}\n")
        
    def checkForExit(self):
        if keyboard.is_pressed('esc'):
            self.logFile.close()
            return True
        return False
    
    def checkForReset(self):
          if keyboard.is_pressed('space'):
            self.socket.send(b'{"Reset": "True"}')
            self.receive_data()

    def controlWithWSAD(self):
        if keyboard.is_pressed('w'):
            self.manualControls.throttle = 100
            self.manualControls.brakes = 0
        elif keyboard.is_pressed('s'):
            self.manualControls.brakes = 100
            self.manualControls.throttle = 0
        else:
            self.manualControls.throttle = 0
            self.manualControls.brakes = 0
        if keyboard.is_pressed('a'):
            self.manualControls.steering -= 5
        elif keyboard.is_pressed('d'):
            self.manualControls.steering += 5
        else:
            self.manualControls.steering = 0
        if keyboard.is_pressed('r'):
            self.manualControls.reset = True
        else:
            self.manualControls.reset = False
        print(self.carData["TrackInfo"]["TrackDistance"])
        return self.manualControls.throttle, self.manualControls.brakes, self.manualControls.steering, self.manualControls.reset
        
    def printLastandFastestLap(self):
        if 0 < self.carData["TrackInfo"]["TrackDistance"] < 50:
            try:  
                print("Fastest Lap: ", self.carData["FastestLap"])
                print("LastLap:", self.carData["LastLap"])
            except:
                pass
    
    def overrideFirstMeters(self):
        while (self.carData["TrackInfo"]["TrackDistance"] < 40 or self.carData["TrackInfo"]["TrackDistance"] >1900 )and self.firstRound:
            self.gearShifter()
            self.carCommand = {
                "Throttle": 100
            }
            message = json.dumps(self.carCommand).encode()
            self.socket.send(message)
            self.receive_data()
        self.firstRound = False

    def doPitStop(self):
        if self.carData["CarInfo"]["BrakeWear"] > 80 or self.carData["CarInfo"]["TireWear"] > 70 or self.carData["CarInfo"]["TireExploded"]:
            print("Pitstop necessary")
            if self.carData["TrackInfo"]["TrackDistance"] > 1900:
                print("Pitstop started")
                # distance_from_center = self.carData['TrackInfo']["DistanceToMiddle"]
                # steering = self.steeringPid(distance_from_center)
                # steering = self.limitValue(steering, -100, 100)
                self.socket.send(b'{"Throttle": "0", "Brakes": "100"}')
                self.receive_data()
                time.sleep(5)
                print("Pitstop done")
                self.socket.send(b'{"Throttle": "100", "Brakes": "0"}')
                self.receive_data()
                time.sleep(4)
                

            
    def control_loop(self):
        self.send_command( 0, 0, 0, "False")
        self.receive_data()
        self.socket.send(b'{"Reset": "True"}')
        self.receive_data()
        self.setPointData = helper.readCSVLogFile("workFile.csv")

        while True:
            # throttle, brakes, steering, reset = self.controlWithWSAD()
            throttle, brakes, steering, reset = self.compute_control()
            self.gearShifter()
            self.overrideFirstMeters()
            # self.printLastandFastestLap()
            self.doPitStop()
            self.send_command(throttle, brakes, steering, reset)
            self.receive_data()
            self.recordRunToFile()
            self.checkForReset()
            if self.checkForExit():
                break
    


if __name__ == "__main__":
    # Start the controller for car on port 5555
    car_controller = CarController(car_port=5555)
    car_controller.control_loop()
