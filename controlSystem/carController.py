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
        self.speedPid = PID(Kp=10, Ki=0.01, Kd=0.1, setpoint=0)
        self.speedPid.output_limits = (-100, 100)
    
    def send_command(self, gear, throttle, brakes, steering, reset):
        self.carCommand = {
            "Throttle": throttle,
            "Brakes": brakes,
            "SteeringWheel": steering
        }
        if gear in ["up", "down", "neutral"]:
            self.carCommand["GearSelection"] = gear
        
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
        current_gear = self.carData["CurrentGear"]
        
        if speed < 8 and current_gear != 1:  # 100 km/h in m/s
            gear = "up" if current_gear < 1 else "down"
        elif 8 <= speed < 15 and current_gear != 2:  # 200 km/h in m/s
            gear = "up" if current_gear < 2 else "down"
        elif 15 <= speed < 20 and current_gear != 3:  # 300 km/h in m/s
            gear = "up" if current_gear < 3 else "down"
        elif 20 <= speed < 30 and current_gear != 4:  # 400 km/h in m/s
            gear = "up" if current_gear < 4 else "down"
        elif speed >= 30 and current_gear != 5:  # 400+ km/h in m/s
            gear = "up" if current_gear < 5 else "down"
        else:
            gear = "hold"
            
        reset = "False"
        
        gear = str(gear)
        throttle = int(throttle)
        brakes = int(brakes)
        steering = int(steering)
        print(gear, throttle, brakes, steering, reset, speed)
        return gear, throttle, brakes, steering, reset

    def control_loop(self):
        self.send_command("up", 0, 0, 0, "False")
        self.receive_data()
        while True:
            gear, throttle, brakes, steering, reset = self.compute_control()
            self.send_command(gear, throttle, brakes, steering, reset)
            self.receive_data()
            
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
            
        maxDegree = 0
        for i in range(0, intLookAhead):
            angle = self.carData["UpcomingTrackInfoFollowing"][str(intLookAhead*10)]
            
    
            if maxDegree < abs(angle):
                maxDegree = abs(angle)
        
        # Use the PID controller to adjust speed based on the degree of the curve
        speed_adjustment = self.speedPid(abs(self.carData['TrackInfo']["DistanceToMiddle"])) * -10
        print("                                ",speed_adjustment)
        if speed_adjustment > 0:
            throttle = speed_adjustment
            brakes = 0
        else:
            throttle = 0
            brakes = abs(speed_adjustment)
        
        throttle = self.limitValue(throttle, 0, 100)
        brakes = self.limitValue(brakes, 0, 100)
        return throttle, brakes
        
        
        

        

if __name__ == "__main__":
    # Start the controller for car on port 5555
    car_controller = CarController(car_port=5555)
    car_controller.control_loop()
