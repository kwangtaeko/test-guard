package com.example;

import org.junit.jupiter.api.Test;

// @Test void commentedOut() { assertEquals(1, 1); }

/*
 * @Disabled
 * @Test
 */
class OrderServiceTests {
    private static final String NOTE = "@Test assertEquals( // not code";
    private static final char QUOTE = '"';
    private static final String BLOCK = """
        @Disabled
        assertTrue(true);
        """;

    @Test
    void createsOrder() {
        String id = "order-1"; // assertNotNull(id);
        org.junit.jupiter.api.Assertions.assertNotNull(id);
    }

    void reassertState() {
        reassert(true);
    }

    void reassert(boolean value) {}
}
