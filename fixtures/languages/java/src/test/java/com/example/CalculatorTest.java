package com.example;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class CalculatorTest {
    @Test
    void adds() {
        assertEquals(2, 1 + 1);
        Assertions.assertTrue(true);
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3})
    void positive(int n) {
        assertThat(n).isPositive();
    }

    @RepeatedTest(3)
    void repeated() {
        assumeTrue(System.getenv("CI") != null);
        assertThrows(ArithmeticException.class, () -> divide(1, 0));
    }

    @Disabled("flaky")
    @Test
    void disabled() {
        fail("not implemented");
    }

    @org.junit.Test
    @org.junit.Ignore
    public void legacy() {
        Assertions.fail();
    }

    private static int divide(int a, int b) {
        return a / b;
    }
}
