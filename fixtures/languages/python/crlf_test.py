import pytest


def test_one():
    assert 1 == 1


@pytest.mark.skip
def test_two():
    assert 2 == 2
