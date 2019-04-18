data class TextStyle(val font: String, val fontSize: Float, @QualifiedColor val color: Color) {
    fun typeface(): Typeface {
        if (foreignFontCache.containsKey(font)) {
            return foreignFontCache.get(font)!!
        }

        if (systemFontCache.isEmpty()) {
            FontRegistry.registerSystemFonts()
        }

        if (systemFontCache.containsKey(font)) {
            val resolver = systemFontCache.get(font)!!
            val typeface = Typeface.create(Typeface.create(resolver.name, Typeface.NORMAL), resolver.weight, resolver.isItalic)
            foreignFontCache.set(font, typeface)
            return typeface
        }

        // Just use the system default/
        return Typeface.create(null, 500, false)
    }

    fun setTextStyle(view: TextView) {
        view.typeface = typeface()
        view.textSize = fontSize
        view.setTextColor(color)
    }
}
