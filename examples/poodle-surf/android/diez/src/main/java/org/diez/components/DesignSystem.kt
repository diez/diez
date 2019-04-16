package org.diez.components

import android.graphics.Color as CoreColor
import org.diez.color.Color
import org.diez.puente.Method
import org.diez.puente.StateBag
import org.diez.color.ColorAdapter
import org.diez.color.QualifiedColor
import org.diez.color.WireColor
import org.diez.typography.TextStyle

val colorAdapter = ColorAdapter()

data class SimpleGradient(
    @QualifiedColor val startColor: Color = ColorAdapter.hsla(WireColor(0.9574652777777778F, 1F, 0.6235294117647059F, 1F)),
    @QualifiedColor val endColor: Color = ColorAdapter.hsla(WireColor(0.08121827411167512F, 1F, 0.6137254901960785F, 1F)),
    val startPointX: Float = 0F,
    val startPointY: Float = 0F,
    val endPointX: Float = 0F,
    val endPointY: Float = 0F
)

data class Palette(
    @QualifiedColor val pink: Color = ColorAdapter.hsla(WireColor(0.9574652777777778F, 1F, 0.6235294117647059F, 1F)),
    @QualifiedColor val orange: Color = ColorAdapter.hsla(WireColor(0.08121827411167512F, 1F, 0.6137254901960785F, 1F)),
    @QualifiedColor val blue: Color = ColorAdapter.hsla(WireColor(0.5576441102756892F, 0.9708029197080293F, 0.7313725490196079F, 1F)),
    @QualifiedColor val white: Color = ColorAdapter.hsla(WireColor(0F, 0F, 1F, 1F)),
    @QualifiedColor val whiteA40: Color = ColorAdapter.hsla(WireColor(0F, 0F, 1F, 0.4F)),
    @QualifiedColor val black: Color = ColorAdapter.hsla(WireColor(0F, 0F, 0F, 1F)),
    val gradient: SimpleGradient = SimpleGradient()
)

data class TextStyles(
    val headerTitle: TextStyle = TextStyle(
        "Helvetica-Bold",
        20F,
        ColorAdapter.hsla(WireColor(0F, 0F, 0F, 1F)))
)

data class DesignSystem(
    var palette: Palette = Palette(),
    var textStyles: TextStyles = TextStyles()
) : StateBag {
    override val adapters = listOf(
        colorAdapter
    )

    override val name = "DesignSystem"

    @Transient
    private var listener: Method? = null

    override fun listen(listener: Method) {
        this.listener = listener
    }
}
