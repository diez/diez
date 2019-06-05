package org.diez.stub

data class Bindings(
    val image: Image = Image(File("assets/image%20with%20spaces.jpg", "image"), File("assets/image%20with%20spaces@2x.jpg", "image"), File("assets/image%20with%20spaces@3x.jpg", "image"), File("assets/image%20with%20spaces@4x.jpg", "image"), 246, 246),
    val lottie: Lottie = Lottie(File("assets/lottie.json", "raw"), true, true),
    val fontRegistry: FontRegistry = FontRegistry(arrayOf<File>(File("assets/SomeFont.ttf", "font"))),
    val typograph: Typograph = Typograph("Helvetica", 50F, Color(0.16666666666666666F, 1F, 0.5F, 1F))
) : StateBag {
    companion object {}
    override val name = "Bindings"
}
