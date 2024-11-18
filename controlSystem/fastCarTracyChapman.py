import zmq
import json
import numpy as np
import time
import keyboard
from simple_pid import PID
import helper
from vectorCalc import TrackVector
import time


class ManualControls:
    def __init__(self):
        self.throttle = 0
        self.brakes = 0
        self.steering = 0
        self.reset = False
        self.gear = 0


class PID:
    def __init__(self, Kp, Ki, Kd):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.prev_error = 0
        self.integral = 0

    def update(self, error):
        self.integral += error
        derivative = error - self.prev_error
        self.prev_error = error
        return self.Kp * error + self.Ki * self.integral + self.Kd * derivative

class CarController:
    def __init__(self, car_port):
        # ZeroMQ setup
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REQ)
        self.socket.connect(f"tcp://localhost:{car_port}") #192.168.10.25
        #self.socket.connect(f"tcp://localhost:{car_port}") #192.168.10.25
        self.carData = None
        self.carCommand = None

        # Create a PID for the steering towards the centerline setpoint and the angle towards track center
        self.pid_steering = PID(Kp=5.5, Ki=0.15, Kd=7.95)
        self.pid_angle = PID(Kp=5.5, Ki=0.08, Kd=5.15)

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
        time.sleep(0.01)

        # Extract necessary car data
        speed = self.carData["CurrentSpeed"]
        dcent = self.carData['TrackInfo']["DistanceToMiddle"]
        dtrack = self.carData["TrackInfo"]["TrackDistance"]    

        track_angle = self.carData["TrackInfo"]["AngleToMiddle"]

        # Determine the next turn angle based on upcoming track information
        upcoming_track_info = self.carData["UpcomingTrackInfoFollowing"]     

        # The algorithm uses the track data ahead to determine how much the throttle
        # should be used.
        # Certain sections of the track are challenging; in a chicane, looking too far ahead
        # will make the car think it is going straight, albeit slower. This is not the case,
        # so to temper the amount of throttle, create a Throttle Factor (TF) to limit the
        # maximum amount of throttle the car can use. This will make it easier to stay within
        # track limits.
        #
        # An alternative would be to limit how far the car looks ahead based on the track position
        # or speed. Quick tests showed that this quickly becomes unstable if not implemented carefully.
        # Although it still seems like the best option, the TF is quick-and-dirty and good enough
        # for the Hackathon.
        TF = 1
        if(dtrack > 450):
            TF = 0.4
        if(dtrack > 550):
            TF = 1.4
        if(dtrack > 1000):
            TF = 0.25
        if(dtrack > 1150):
            TF = 0.45
        if(dtrack > 1350):
            TF = 0.5    
        if(dtrack > 1500):
            TF = 0.68
        if(dtrack > 1550):
            TF = 0.45    
        if(dtrack > 1600):
            TF = 1
        if(dtrack > 1700):
            TF = 0.90                            
        if(dtrack > 1800):  
            TF = 1.8

        # Desired values for the angle and track position
        desired_distance = 0  # As a starting point, the car should be at the center of the track
        desired_angle = 0     # Ideally, the car should be aligned with the track

        # The center of the track isn't always the best place to be. If there is a sharp corner ahead,
        # the car should stick to the outside of the track, so it can hit the apex of the corner.
        # If there is a long and fast corner, stick to the inside of the corner - this is shorter.
        # Negative values: left hand side of track. Positive values, right hand side of track
        if(dtrack > 40):
            desired_distance = 0.0
        if(dtrack > 150):
            desired_distance = -1.5        
        if(dtrack > 200):
            desired_distance = -3.5
        if(dtrack > 600):
            desired_distance = -4.0            
        if(dtrack > 1000):
            desired_distance = 0.5
        if(dtrack > 1200):
            desired_distance = 1.5            
        if(dtrack > 1300):
            desired_distance = -3.0
        if(dtrack > 1600):
            desired_distance = 1.0
        if(dtrack > 1950):
            desired_distance = -3.0            

        # Get current values for the distance to- and angle relative to track center
        current_distance = dcent
        current_angle = track_angle

        # Calculate control values
        control_distance = self.pid_steering.update(desired_distance - current_distance)
        control_angle = self.pid_angle.update(desired_angle - current_angle)

        # The car will look at the track ahead to determine how much throttle, brakes and steering it
        # should apply. The TrackVector class calculates the resulting vector out of all smaller vectors
        # provided by the track. The section length and relative angle are decomposed 
        # into an X (steering) and Y (throttle/brake) vector.
        # For brake and throttle: look far ahead. Braking takes a lot of time, so corners should be
        # detected as early as possible. Also, if there is a long straight track ahead, the vector for
        # the throttle should be as big as possible! Pedal to the metal!! :)

        #trackVector = TrackVector(upcoming_track_info)

        # This integer below determines how far the vector looks ahead. For now, enter it manually.
        #                                                                      vv
        trackSpeedVector = TrackVector(dict(list(upcoming_track_info.items())[:10]))
        speedV = trackSpeedVector.calculateVector() 

        # Prepare to make the braking vector seperate from the throttle vector if necessary.
        # Not actively in use so far..
        trackBrakingVector = TrackVector(dict(list(upcoming_track_info.items())[:10]))
        brakeV = trackBrakingVector.calculateVector()

        # The PID is always late! If you want to steer to the center of the track,
        # you will always miss the apex of the corner. Therefore, also look at the
        # track in the future. The steering vector will determine how far the next
        # section will go either left or right. This can be used to push the car
        # AWAY from the PID setpoint, so it can hit the apex in sharp corners.
        # In gentle corners, the X-vector will be very SMALL and will hardly impact
        # steering. The PID will then just steer towards the configured track position. In sharp corners, 
        # the X-vector will be LARGE, to the car will already start steering BEFORE the
        # corner even begins. This is exactly what we want.
        # Use this with caution: only 
        steeringVector = TrackVector(dict(list(upcoming_track_info.items())[:2]))
        steerV = steeringVector.calculateVector()

        # Combine the control values (may need to adjust the weights).
        # The X-steering vector (steerV) must weigh in heavy. In gentle bends
        # the value is near zero and will therefore hardly impact steering.
        # In sharp bends, use it to steer aggressively towards the apex.
        control = 1.2* control_distance + 0.8 * control_angle + 9.5 * steerV.x

        # Ensure the control value is within the steering limits
        control = max(-100, min(100, control))

        # Write the control in the steering variable. Not really necessary to make an
        # extra variable for this, but hey, we already had this variable before implementing
        # the PID control ;)
        steering = control
        
        # Now look at braking / throttle
        brakes = 0
        throttle = 0

        # We want to apply the brakes based on a ratio of speed and steering vector:
        # - If the car is driving FAST, and a sharp corner is ahead, braking MUST be aggresive!
        # - If the car is driving FAST, and a GENTLE corner is ahead, braking MIGHT be necessary when the car starts to drift
        # Therefore, take the product of these two, and apply a threshold. The threshold and factor are just trial-and-error for good values

        # Also, the threshold will prevent unnecessary braking
        # - If the car is driving SLOW, and a REALLY sharp corner is ahead, we're fine
        # - If the car is driving SLOW, and a GENTLE corner is ahead, 

        # The amount of braked that will be applied are a function of speed and steering as well
        # High speed? More brakes. Almost coming to a stop? Release the brakes gradually. 
        # Sharp corner ahead? Hit the brakes! Gentle corner ahead? Hardly any brakes are needed.
        if(speed * speedV.x > 2000):
            brakes = (0.003*speed*steerV.x)
        else:
            throttle = speedV.y * 2 * TF

        # Implement a simple pit-stop strategy. Brake to a full stop just before start/finish, until the
        # tires have been replaced. The car will get moving automatically when the tires are replaced and
        # the brakes are released, since the speed vector tells the car how much it should accelerate.
        tirewear = self.carData["CarInfo"]["TireWear"]
        if(dtrack > 1900 and tirewear > 70):
            brakes = 100
            

        reset = "False"
        
        throttle = int(throttle )
        self.command["Throttle"] = throttle
        brakes = int(brakes )
        self.command["Brakes"] = brakes
        steering = int(steering )
        self.command["SteeringWheel"] = steering
        # print(throttle, brakes, steering, reset, speed)

        # Just some values for debugging and optimizing some factors
        print( self.carData["LastLap"], "d", dtrack, "tirewear", tirewear , "v", speed, "dc", dcent, "Sv:", steerV.x, "S", steering, "Tv:", speedV.y, "T", throttle, "Bv:", brakeV.y, "B", brakes)

        return throttle, brakes, steering, reset

            
    def limitValue(self, value, min, max):
        if value < min:
            return min
        elif value > max:
            return max
        else:
            return value
        
    # Gearshifter. Credits to Timo and the Swiss colleagues :)
    def gearShifter(self):
        speed = self.carData["CurrentSpeed"]
        current_gear = self.carData["CurrentGear"]

        shift_mapping = [ 
                         (0, 6), 
                         (2, 16), 
                         (10, 24), #gear 3
                         (20, 35), #gear 4
                         (27, 40), 
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
        #self.logFile.write(f"{time.time()};{speed};{distance_from_center};{track_angle};{track_distance};{world_position};{world_rotation};{throttle};{brakes};{steering};{gear}\n")
        
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
        #self.socket.send(b'{"Reset": "True"}')
        #self.receive_data()
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
    #car_controller = CarController(car_port=5555)
    car_controller.control_loop()
