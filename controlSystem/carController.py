import zmq
import json
import numpy as np
import time
import keyboard
from simple_pid import PID

class CarController:
    def __init__(self, car_port):
        # ZeroMQ setup
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REQ)
        self.socket.connect(f"tcp://localhost:{car_port}") #192.168.10.25
        self.carData = None
        self.carCommand = None
        self.steeringPid = PID(Kp=10, Ki=0.5, Kd=20, setpoint=0)
        self.speedPid = PID(Kp=10, Ki=0.01, Kd=0.1, setpoint=10)
        self.speedPid.output_limits = (-100, 100)
        self.command = {}
        self.command["Throttle"] = 0
        self.command["Brakes"] = 0
        self.command["SteeringWheel"] = 0
        self.command["Gear"] = 0
        self.logFile = open("log.csv", "w")
    
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
        # Extract necessary car data
        intLookAhead = int(self.carData["CurrentSpeed"] / 100) + 1
        if intLookAhead > 10:
            intLookAhead = 10
        if intLookAhead < 1:
            intLookAhead = 1
            
        sumAngle = 0
        for i in range(0, intLookAhead):
            angle = self.carData["UpcomingTrackInfoFollowing"][str(intLookAhead*10)]
            sumAngle += angle
        
        # Linear control for speed adjustment based on sumAngle
        speed_adjustment = self.speedPid(self.carData["CurrentSpeed"])
        
        if speed_adjustment > 0:
            throttle = speed_adjustment
            brakes = 0
        else:
            throttle = 0
            brakes = abs(speed_adjustment)
        
        throttle = self.limitValue(throttle, 0, 100)
        brakes = self.limitValue(brakes, 0, 100)
        print("sumAngle:", sumAngle, "Linear Result", speed_adjustment, "Throttle:", throttle, "Brakes:", brakes)
        return throttle, brakes
        
    def gearShifter(self):
        speed = self.carData["CurrentSpeed"]
        current_gear = self.carData["CurrentGear"]
        
        if not hasattr(self, 'gear_shift_counter'):
            self.gear_shift_counter = 0
        
        self.gear_shift_counter += 1
        
        if self.gear_shift_counter % 10 == 0:
            if speed < 4:
                desired_gear = 1
            elif 4 <= speed < 8:
                desired_gear = 2
            elif 8 <= speed < 12:
                desired_gear = 3
            elif 12 <= speed < 30:
                desired_gear = 4
            elif speed >= 30:
                desired_gear = 5
            else:
                desired_gear = current_gear
            
            print("Current Gear:", current_gear, "Desired Gear:", desired_gear)
            desired_gear = 2
            
            while current_gear != desired_gear:
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
        world_position = self.carData["WorldPosition"]
        world_rotation = self.carData["WorldRotation"]
        throttle = self.carCommand["Throttle"]
        brakes = self.carCommand["Brakes"]
        steering = self.carCommand["SteeringWheel"]
        gear = self.carData["CurrentGear"]
        #log to csv file
        self.logFile.write(f"{time.time()},{speed},{distance_from_center},{track_angle},{track_distance},{world_position},{world_rotation},{throttle},{brakes},{steering},{gear}\n")
        
    def checkForExit(self):
        if keyboard.is_pressed('esc'):
            self.logFile.close()
            return True
        return False
    
    def checkForReset(self):
          if keyboard.is_pressed('space'):
            self.socket.send(b'{"Reset": "True"}')
            self.receive_data()

            
    def control_loop(self):
        self.send_command( 0, 0, 0, "False")
        self.receive_data()
        while True:
            throttle, brakes, steering, reset = self.compute_control()
            self.gearShifter()
            self.send_command(throttle, brakes, steering, reset)
            self.receive_data()
            self.checkForReset()
            if self.checkForExit():
                break
        

if __name__ == "__main__":
    # Start the controller for car on port 5555
    car_controller = CarController(car_port=5555)
    car_controller.control_loop()
