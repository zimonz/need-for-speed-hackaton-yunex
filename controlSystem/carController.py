import zmq
import json
import numpy as np
import time

class CarController:
    def __init__(self, car_port):
        # ZeroMQ setup
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REQ)
        self.socket.connect(f"tcp://localhost:{car_port}") #192.168.10.25
        self.carData = None
        self.carCommand = None
    
    def send_command(self, gear, throttle, brakes, steering, reset):
        self.carCommand = {
            "Throttle": throttle,
            "Brakes": brakes,
            "SteeringWheel": steering
        }
        if gear in ["up", "down", "neutral"]:
            self.carCommand["GearSelection"] = gear
            # "Reset": reset
        }
        message = json.dumps(self.carCommand).encode()
        print(message)
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
        steering = int(-distance_from_center / 100)  # Keep car centered
        
        # Adjust speed based on upcoming turns
        if abs(next_turn_angle) > 20:  # Sharp turn
            throttle = 50  # 50% throttle
            brakes = 20  # 20% brakes
        else:
            throttle = 80  # 80% throttle
            brakes = 0  # No brakes
        
        # Adjust gear dynamically
        current_gear = self.carData["CurrentGear"]
        
        if speed < 20 and current_gear != 1:
            gear = "up" if current_gear < 1 else "down"
        elif 20 <= speed < 40 and current_gear != 2:
            gear = "up" if current_gear < 2 else "down"
        elif 40 <= speed < 60 and current_gear != 3:
            gear = "up" if current_gear < 3 else "down"
        elif 60 <= speed < 80 and current_gear != 4:
            gear = "up" if current_gear < 4 else "down"
        elif speed >= 80 and current_gear != 5:
            gear = "up" if current_gear < 5 else "down"
        else:
            gear = "hold"
            
        reset = "False"
        
        return gear, throttle, brakes, steering, reset

    def control_loop(self):
        self.send_command("neutral", 0, 0, 0, "False")
        self.receive_data()
        print(self.carData)
        while True:
            gear, throttle, brakes, steering, reset = self.compute_control()
            self.send_command(gear, throttle, brakes, steering, reset)
            self.carData = self.receive_data()

if __name__ == "__main__":
    # Start the controller for car on port 5555
    car_controller = CarController(car_port=5555)
    car_controller.control_loop()
