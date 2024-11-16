import math

class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"


class TrackVector:
    def __init__(self, trackFuture):
        self.trackFuture = trackFuture

    def calculateVector(self):
        resultingVector = Vector(0,0)
        totalAngle = 0
        for key, value in self.trackFuture.items():
            totalAngle += (value/180)*math.pi
            resultingVector += Vector(10*math.sin(totalAngle), 10*math.cos(totalAngle))
        return resultingVector
# Example usage:


#trackFuture = {'10': -0.3626169, '20': 0.198810175, '30': -0.8256681, '40': -3.68068, '50': -2.08093071, '60': 0.5834977, '70': 4.55883265, '80': 9.548328, '90': 36.8816261, '100': 1.98435783}
#trackFuture = {'10': -0.3626169, '20': 0.198810175, '30': -0.8256681, '40': -3.68068, '50': -2.08093071, '60': 0.5834977, '70': 4.55883265, '80': 9.548328, '90': 0.8816261, '100': 1.98435783}
trackFuture = {'10': -45, '20': -45, '30': -45}
resultingVector = TrackVector(trackFuture)

print(resultingVector.calculateVector())  # Output: Vector(5, 7, 9)