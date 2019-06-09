package org.diez.stub

data class Font(
    val file: File = File("assets/SomeFont.ttf", "font"),
    val name: String = "SomeFont"
) {
    companion object {}
}
