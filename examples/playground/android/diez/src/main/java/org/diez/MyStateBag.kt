package org.diez

import com.squareup.moshi.Moshi
import android.graphics.Color as CoreColor

data class MyPalette(@QualifiedColor var hello: Color = ColorAdapter.hsla(
    WireColor(
        0F,
        1F,
        0.5F,
        1F
    )
))

data class MyStateBag(
    var palette: MyPalette = MyPalette(),
    var copy: String = "Hello Diez",
    var image: Image = Image(File("assets/images/haiku.jpg"), 246, 246, 3F),
    var fontRegistry: FontRegistry = FontRegistry(
        arrayOf<File>(
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
        )
    ),
    var textStyle: TextStyle = TextStyle(
        "Helvetica",
        50F,
        ColorAdapter.hsla(WireColor(0F, 1F, 0.5F, 1F))
    ),
    var haiku: Haiku = Haiku("@haiku/taylor-testthang"),
    var svg: SVG = SVG("assets/images/rat.svg"),
    var lottie: Lottie = Lottie(File("assets/lottie/loading-pizza.json"))
) : StateBag {
    override fun registerAdapters(builder: Moshi.Builder) {
        builder.add(colorAdapter)
    }

    override val name = "MyStateBag"
}
