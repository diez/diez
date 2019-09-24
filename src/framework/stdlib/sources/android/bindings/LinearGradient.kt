package {{{packageName}}}

import android.graphics.Shader
import android.graphics.LinearGradient
import android.graphics.drawable.ShapeDrawable

{{> androidDataClassStart }}

    private class LinearGradientShaderFactory(val startX: Float, val startY: Float, val endX: Float, val endY: Float,
                                              private val colors: IntArray,
                                              private val positions: FloatArray): ShapeDrawable.ShaderFactory() {
        override fun resize(width: Int, height: Int): Shader {
            return LinearGradient(
                width * startX,
                height * startY,
                width * endX,
                height * endY,
                colors,
                positions,
                Shader.TileMode.CLAMP)
        }
    }

    val shaderFactory: ShapeDrawable.ShaderFactory
        get() {
            return LinearGradientShaderFactory(
                start.x, start.y,
                end.x, end.y,
                stops.map({ it.color.color }).toIntArray(),
                stops.map({ it.position }).toFloatArray())
        }
}
