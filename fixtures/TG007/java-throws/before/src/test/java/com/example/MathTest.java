package com.example;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class MathTest {
    @Test
    void dividesByZero() {
        assertThrows(ArithmeticException.class, () -> MathUtils.div(1, 0));
    }
}
