import zmq
import json
import numpy as np

class CarController:
    def __init__(self, car_port):
        # ZeroMQ setup
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REQ)
        self.socket.connect(f"tcp://localhost:{car_port}")
        self.carData = None
        self.carCommand = {
            "GearSelection": "up",
            "Throttle": 0.1,
            "Brakes": 0,
            "SteeringWheel": 0
            # "Reset": False
        }
    
    def send_command(self, gear, throttle, brakes, steering, reset=False):
        self.carCommand = {
            "GearSelection": gear,
            "Throttle": throttle,
            "Brakes": brakes,
            "SteeringWheel": steering
            # "Reset": reset
        }
        message = json.dumps(self.carCommand).encode()
        self.socket.send(message)
    
    def receive_data(self):
        message = self.socket.recv()
        self.carData = json.loads(message.decode())

    def compute_control(self, car_data):
        # Extract necessary car data
        speed = car_data["CurrentSpeed"]
        distance_from_center = car_data['TrackInfo']["DistanceToMiddle"]
        track_angle = car_data["TrackInfo"]["AngleToMiddle"]
        # Determine the next turn angle based on upcoming track information
        upcoming_track_info = car_data["UpcomingTrackInfoFollowing"]
        next_turn_angle = upcoming_track_info["10"]  # Example: using the angle at 10 units ahead
        
        # Adjust steering
        steering = -distance_from_center / 100  # Keep car centered
        
        # Adjust speed based on upcoming turns
        if abs(next_turn_angle) > 20:  # Sharp turn
            throttle = 0.5
            brakes = 0.2
        else:
            throttle = 0.8
            brakes = 0
        
        # Adjust gear dynamically
        if speed < 30:
            gear = "up"
        elif speed > 80:
            gear = "down"
        else:
            gear = "neutral"
        
        return gear, throttle, brakes, steering

    def control_loop(self):
        self.send_command("up", 0.1 , 0 ,0, False)
        car_data = self.receive_data()
        while True:
            gear, throttle, brakes, steering = self.compute_control(car_data)
            self.send_command(gear, throttle, brakes, steering)
            self.carData = self.receive_data()

if __name__ == "__main__":
    # Start the controller for car on port 5555
    car_controller = CarController(car_port=5555)
    car_controller.control_loop()
