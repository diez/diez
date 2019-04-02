package ai.haiku.diez.components

import android.graphics.Color as CoreColor
import ai.haiku.diez.color.Color
import ai.haiku.diez.puente.Method
import ai.haiku.diez.puente.StateBag
import ai.haiku.diez.color.ColorAdapter
import ai.haiku.diez.color.QualifiedColor
import ai.haiku.diez.file.File
import ai.haiku.diez.haiku.Haiku
import ai.haiku.diez.image.Image
import ai.haiku.diez.image.SVG
import ai.haiku.diez.lottie.Lottie
import ai.haiku.diez.typography.FontRegistry
import ai.haiku.diez.typography.TextStyle

val colorAdapter = ColorAdapter()

data class MyPalette(@QualifiedColor var hello: Color = ColorAdapter.hsla(floatArrayOf(0F, 1F, 0.5F, 1F)))

data class MyStateBag(
    var palette: MyPalette = MyPalette(),
    var copy: String = "Hello Diez",
    var image: Image = Image(File("/assets/images/haiku.jpg"), 246, 246, 3F),
    var fontRegistry: FontRegistry = FontRegistry(arrayOf<File>(
        File("/assets/fonts/Roboto-Black.ttf"),
        File("/assets/fonts/Roboto-BlackItalic.ttf"),
        File("/assets/fonts/Roboto-Bold.ttf"),
        File("/assets/fonts/Roboto-BoldItalic.ttf"),
        File("/assets/fonts/Roboto-Italic.ttf"),
        File("/assets/fonts/Roboto-Light.ttf"),
        File("/assets/fonts/Roboto-LightItalic.ttf"),
        File("/assets/fonts/Roboto-Medium.ttf"),
        File("/assets/fonts/Roboto-MediumItalic.ttf"),
        File("/assets/fonts/Roboto-Regular.ttf"),
        File("/assets/fonts/Roboto-Thin.ttf"),
        File("/assets/fonts/Roboto-ThinItalic.ttf")
    )),
    var textStyle: TextStyle = TextStyle(
        "Helvetica",
        50F,
        ColorAdapter.hsla(floatArrayOf(0F, 1F, 0.5F, 1F))
    ),
    var haiku: Haiku = Haiku("@haiku/taylor-testthang"),
    var svg: SVG = SVG(File("/assets/images/rat.svg")),
    var lottie: Lottie = Lottie(File("/assets/lottie/loading-pizza.json"))
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

    fun tap() {
        if (this.listener == null) {
            return
        }

        this.listener!!("tap", null)
    }
}
