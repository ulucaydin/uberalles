from utils import meter_to_radian

def test_meter_to_radian_1():
    assert meter_to_radian(5000) == 5000

def test_meter_to_radian_2():
    assert meter_to_radian(0) == 0.0
