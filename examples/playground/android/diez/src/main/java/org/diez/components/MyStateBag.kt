package org.diez.components

import android.graphics.Color as CoreColor
import org.diez.color.Color
import org.diez.puente.Method
import org.diez.puente.StateBag
import org.diez.color.ColorAdapter
import org.diez.color.QualifiedColor
import org.diez.color.WireColor
import org.diez.file.File
import org.diez.haiku.Haiku
import org.diez.image.Image
import org.diez.image.SVG
import org.diez.lottie.Lottie
import org.diez.typography.FontRegistry
import org.diez.typography.TextStyle

data class MyPalette(@QualifiedColor var hello: Color = ColorAdapter.hsla(WireColor(0F, 1F, 0.5F, 1F)))

data class MyStateBag(
    var palette: MyPalette = MyPalette(),
    var copy: String = "Hello Diez",
    var image: Image = Image(File("assets/images/haiku.jpg"), 246, 246, 3F),
    var fontRegistry: FontRegistry = FontRegistry(arrayOf<File>(
        File("assets/fonts/Roboto-Black.ttf"),
        File("assets/fonts/Roboto-BlackItalic.ttf"),
        File("assets/fonts/Roboto-Bold.ttf"),
        File("assets/fonts/Roboto-BoldItalic.ttf"),
        File("assets/fonts/Roboto-Italic.ttf"),
        File("assets/fonts/Roboto-Light.ttf"),
        File("assets/fonts/Roboto-LightItalic.ttf"),
        File("assets/fonts/Roboto-Medium.ttf"),
        File("assets/fonts/Roboto-MediumItalic.ttf"),
        File("assets/fonts/Roboto-Regular.ttf"),
        File("assets/fonts/Roboto-Thin.ttf"),
        File("assets/fonts/Roboto-ThinItalic.ttf")
    )),
    var textStyle: TextStyle = TextStyle(
        "Helvetica",
        50F,
        ColorAdapter.hsla(WireColor(0F, 1F, 0.5F, 1F))
    ),
    var haiku: Haiku = Haiku("@haiku/taylor-testthang"),
    var svg: SVG = SVG("assets/images/rat.svg"),
    var lottie: Lottie = Lottie(File("assets/lottie/loading-pizza.json"))
) : StateBag {
    override val adapters = listOf(
        colorAdapter
    )

    override val name = "MyStateBag"

    @Transient
    private var listener: Method? = null

    override fun listen(listener: Method) {
        this.listener = listener
    }
}
