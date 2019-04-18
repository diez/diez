typealias Color = Int

@Retention(RUNTIME)
@JsonQualifier
annotation class QualifiedColor

data class WireColor(val h: Float, val s: Float, val l: Float, val a: Float)

class ColorAdapter {
    companion object {
        fun hsla(serial: WireColor) : Color {
            val rgb = ColorUtils.HSLToColor(floatArrayOf(serial.h * 360, serial.s, serial.l))
            return CoreColor.argb(
                (serial.a * 255).toInt(),
                CoreColor.red(rgb),
                CoreColor.green(rgb),
                CoreColor.blue(rgb)
            )
        }
    }

    @FromJson @QualifiedColor
    fun fromJson(serial: WireColor) : Color {
        return ColorAdapter.hsla(serial)
    }

    @ToJson
    fun toJson(@QualifiedColor color: Color) : WireColor {
        val out: FloatArray = floatArrayOf()
        ColorUtils.RGBToHSL(CoreColor.red(color), CoreColor.green(color), CoreColor.blue(color), out)
        return WireColor(
            out[0],
            out[1],
            out[2],
            CoreColor.alpha(color).toFloat()
        )
    }
}

// A ColorAdapter singleton.
val colorAdapter = ColorAdapter()
