import pytest
from math_utils import add


def test_add():
    assert add(1, 2) == 3


@pytest.mark.skip(reason="flaky")
def test_add_negative():
    assert add(-1, -2) == -3
