package org.diez.targetTestStub

/**
 * A component encapsulating color, including alpha transparency.
 * 
 * You can use the provided static constructors [[Color.rgb]], [[Color.rgba]], [[Color.hsl]], [[Color.hsla]], and
 * [[Color.hex]] to conveniently create color primitives using familiar patterns for color specification.
 *
 */
data class Color(
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    val h: Float,
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    val s: Float,
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 0
     */
    val l: Float,
    /**
     * Provides simple hue-saturation-lightness-alpha color data.
     *
     * 1
     */
    val a: Float
) {
    companion object {}
}
