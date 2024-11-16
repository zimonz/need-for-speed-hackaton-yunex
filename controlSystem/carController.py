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
        self.steeringPid = PID(Kp=10, Ki=0.5, Kd=30, setpoint=0)
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
        

    def compute_control(self):
        # Extract necessary car data
        speed = self.carData["CurrentSpeed"]
        distance_from_center = self.carData['TrackInfo']["DistanceToMiddle"]
        track_angle = self.carData["TrackInfo"]["AngleToMiddle"]
        # Determine the next turn angle based on upcoming track information
        upcoming_track_info = self.carData["UpcomingTrackInfoFollowing"]
        next_turn_angle = upcoming_track_info["10"]  # Example: using the angle at 10 units ahead
        
        # Adjust steering
        steering = self.steeringPid(distance_from_center)
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
        
        scalingFactorAccelerate = 0.9
        scalingFactorBrake = 1.0
        
        intCurrentTrackDistance = int(float(currentTrackDistance))
        try:
            setPoint = self.setPointData[intCurrentTrackDistance]
        except KeyError:
            setPoint = self.setPointData[intCurrentTrackDistance - 1]
        throttle = int(setPoint["Throttle"])*scalingFactorAccelerate
        brakes = int(setPoint["Brakes"])*(1-scalingFactorBrake)
        print("Throttle:", int(throttle), "Brakes:", int(brakes), "Current Position:", intCurrentTrackDistance, "Gear:", self.carData["CurrentGear"], "Speed:", int(self.carData["CurrentSpeed"]))
        return throttle, brakes
        
    def gearShifter(self):
        speed = self.carData["CurrentSpeed"]
        current_gear = self.carData["CurrentGear"]

        shift_mapping = [ 
                         (0, 9), 
                         (2, 16), 
                         (10, 24), #gear 3
                         (20, 35), #gear 4
                         (27, 50), 
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
            
        return self.manualControls.throttle, self.manualControls.brakes, self.manualControls.steering, self.manualControls.reset
        


            
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
