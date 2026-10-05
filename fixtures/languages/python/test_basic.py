import unittest

import pytest


def test_add():
    assert 1 + 1 == 2


async def test_async_fetch():
    result = await fetch()
    assert result is not None
    assert(result)


@pytest.mark.parametrize("n", [1, 2, 3])
def test_positive(n):
    assert n > 0


@pytest.mark.skip(reason="flaky")
def test_skipped():
    assert False


@pytest.mark.skipif(True, reason="never")
def test_skipif():
    with pytest.raises(ValueError):
        int("x")


@pytest.mark.xfail
def test_xfail():
    pytest.skip("runtime skip")


class TestMath(unittest.TestCase):
    def testMultiply(self):
        self.assertEqual(2 * 3, 6)
        self.assertTrue(True)

    @unittest.skip("not ready")
    def test_divide(self):
        self.assertRaises(ZeroDivisionError, lambda: 1 / 0)

    def test_env(self):
        self.skipTest("needs env")

    def helper(self):
        return 1
