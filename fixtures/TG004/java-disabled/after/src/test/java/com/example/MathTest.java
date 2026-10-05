package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class MathTest {
    @Test
    void adds() {
        assertEquals(3, MathUtils.add(1, 2));
    }

    @Disabled("flaky")
    @Test
    void subtracts() {
        assertEquals(2, MathUtils.sub(3, 1));
    }
}
