package org.diez.color

import android.graphics.Color as CoreColor
import android.support.v4.graphics.ColorUtils
import com.squareup.moshi.FromJson
import com.squareup.moshi.JsonQualifier
import com.squareup.moshi.ToJson
import kotlin.annotation.AnnotationRetention.RUNTIME

typealias Color = Int

@Retention(RUNTIME)
@JsonQualifier
annotation class QualifiedColor

class ColorAdapter {
    companion object {
        fun hsla(serial: FloatArray) : Color {
            val rgb = ColorUtils.HSLToColor(floatArrayOf(serial[0] * 360, serial[1], serial[2]))
            return CoreColor.argb(
                (serial[3] * 255).toInt(),
                CoreColor.red(rgb),
                CoreColor.green(rgb),
                CoreColor.blue(rgb)
            )
        }
    }

    @FromJson @QualifiedColor
    fun fromJson(serial: FloatArray) : Color {
        return ColorAdapter.hsla(serial)
    }

    @ToJson
    fun toJson(@QualifiedColor color: Color) : FloatArray {
        val out: FloatArray = floatArrayOf()
        ColorUtils.RGBToHSL(CoreColor.red(color), CoreColor.green(color), CoreColor.blue(color), out)
        return floatArrayOf(
            out[0],
            out[1],
            out[2],
            CoreColor.alpha(color).toFloat()
        )
    }
}
