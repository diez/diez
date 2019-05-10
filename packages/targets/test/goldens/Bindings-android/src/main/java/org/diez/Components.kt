package org.diez

data class Image(
    val file1x: File,
    val file2x: File,
    val file3x: File,
    val width: Int,
    val height: Int
)
data class SVG(
    val src: String
)
data class Lottie(
    val file: File,
    val loop: Boolean,
    val autoplay: Boolean
)
data class Color(
    val h: Float,
    val s: Float,
    val l: Float,
    val a: Float
)
data class TextStyle(
    val fontName: String,
    val fontSize: Float,
    val color: Color
)
data class Haiku(
    val component: String,
    val loop: Boolean,
    val autoplay: Boolean
)
data class Bindings(
    val image: Image = Image(File("assets/image%20with%20spaces.jpg"), File("assets/image%20with%20spaces@2x.jpg"), File("assets/image%20with%20spaces@3x.jpg"), 246, 246),
    val svg: SVG = SVG("assets/image.svg"),
    val lottie: Lottie = Lottie(File("assets/lottie.json"), true, true),
    val fontRegistry: FontRegistry = FontRegistry(arrayOf<File>(File("assets/SomeFont.ttf"))),
    val textStyle: TextStyle = TextStyle("Helvetica", 50F, Color(0.16666666666666666F, 1F, 0.5F, 1F)),
    val haiku: Haiku = Haiku("haiku-component", true, true)
) : StateBag {
    override val name = "Bindings"
}

