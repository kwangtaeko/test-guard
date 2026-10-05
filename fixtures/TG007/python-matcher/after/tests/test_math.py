import unittest

from math_utils import add


class AddTest(unittest.TestCase):
    def test_add(self):
        self.assertTrue(add(1, 2))
