// This file was generated with Diez - https://diez.org
// Do not edit this file directly.

package org.diez.stdlibTestStub

/**
 * Describes a fill type.
 *
 */
data class Fill(
    /**
     * Fill data.
     *
     * hsla(0, 1, 0.5, 1)
     */
    val color: Color,
    /**
     * Fill data.
     *
     * start [0, 0], end [1, 1], stops: [hsla(0, 0, 0, 1) at 0,hsla(0, 0, 1, 1) at 1]
     */
    val linearGradient: LinearGradient,
    /**
     * Fill data.
     *
     * Color
     */
    val type: String
) {
    companion object {}
}
