package org.diez.stub

data class Bindings(
    val image: Image = Image(File("assets/image%20with%20spaces.jpg", "image"), File("assets/image%20with%20spaces@2x.jpg", "image"), File("assets/image%20with%20spaces@3x.jpg", "image"), File("assets/image%20with%20spaces@4x.jpg", "image"), 246, 246),
    val lottie: Lottie = Lottie(File("assets/lottie.json", "raw"), true, true),
    val typograph: Typograph = Typograph(Font(File("assets/SomeFont.ttf", "font"), "SomeFont"), 50F, Color(0.16666666666666666F, 1F, 0.5F, 1F)),
    val linearGradient: LinearGradient = LinearGradient(arrayOf<GradientStop>(GradientStop(0F, Color(0F, 1F, 0.5F, 1F)), GradientStop(1F, Color(0.6666666666666666F, 1F, 0.5F, 1F))), Point2D(0F, 0.5F), Point2D(1F, 0.5F)),
    val point: Point2D = Point2D(0.5F, 0.5F)
) : StateBag {
    companion object {}
    override val name = "Bindings"
}
