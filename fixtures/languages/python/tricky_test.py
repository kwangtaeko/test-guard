"""Module docstring mentioning assert and def test_fake():"""

# def test_commented_out():
#     assert True

MESSAGE = "assert inside a string # not a comment"
RAW = r'pytest.skip("x") \' still string'
BLOCK = '''
def test_in_triple_quotes():
    assert 1
'''


def testing_helper_is_collected_by_pytest():
    value = {"key": "#"}  # trailing comment with assert
    assert value["key"] == "#"


def helper_assertion_name():
    assertion = 1
    return assertion
