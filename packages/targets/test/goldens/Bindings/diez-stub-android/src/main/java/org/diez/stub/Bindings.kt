package org.diez.stub

data class Bindings(
    val image: Image = Image(File("assets/image%20with%20spaces.jpg", "image"), File("assets/image%20with%20spaces@2x.jpg", "image"), File("assets/image%20with%20spaces@3x.jpg", "image"), File("assets/image%20with%20spaces@4x.jpg", "image"), Size2D(246F, 246F)),
    val lottie: Lottie = Lottie(File("assets/lottie.json", "raw"), true, true),
    val typograph: Typograph = Typograph(Font(File("assets/SomeFont.ttf", "font"), "SomeFont"), 50F, Color(0.16666666666666666F, 1F, 0.5F, 1F), true),
    val linearGradient: LinearGradient = LinearGradient(arrayOf<GradientStop>(GradientStop(0F, Color(0F, 1F, 0.5F, 1F)), GradientStop(1F, Color(0.6666666666666666F, 1F, 0.5F, 1F))), Point2D(0F, 0.5F), Point2D(1F, 0.5F)),
    val point: Point2D = Point2D(0.5F, 0.5F),
    val size: Size2D = Size2D(400F, 300F),
    val shadow: DropShadow = DropShadow(Point2D(1F, 2F), 3F, Color(0.3333333333333333F, 1F, 0.5F, 0.5F))
) : StateBag {
    companion object {}
    override val name = "Bindings"
}
