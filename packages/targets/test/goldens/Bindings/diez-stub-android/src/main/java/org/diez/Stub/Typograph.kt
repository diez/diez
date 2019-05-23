package org.diez.stub

import java.io.File as CoreFile
import android.graphics.Typeface
import android.widget.TextView

val Typograph.typeface: Typeface
    get() {
        val style = getStyle(fontName)

        if (foreignFontCache.containsKey(fontName)) {
            return foreignFontCache.get(fontName)!!
        }

        if (systemFontCache.isEmpty()) {
            FontRegistry.registerSystemFonts()
        }

        if (systemFontCache.containsKey(fontName)) {
            val resolver = systemFontCache.get(fontName)!!
            val typeface = Typeface.create(Typeface.create(resolver.name, style), resolver.weight, resolver.isItalic)
            foreignFontCache.set(fontName, typeface)
            return typeface
        }

        // Just use the system default.
        return Typeface.create("", style)
    }


// TODO: this should not actually be necessary.
private fun getStyle(fontName: String): Int {
    var style = Typeface.NORMAL
    var containsBold = false
    var containsItalic = false
    if (fontName.contains("bold", true)) {
        style = Typeface.BOLD
        containsBold = true
    }

    if (fontName.contains("italic", true)) {
        style =  Typeface.ITALIC
        containsItalic = true
    }

    if (containsBold && containsItalic) {
        style = Typeface.BOLD_ITALIC
    }
    return style
}

var TextView.typograph: Typograph?
    set(typograph) {
        if (typograph == null) {
            return
        }
        this.typeface = typograph.typeface
        this.textSize = typograph.fontSize
        this.setTextColor(typograph.color.color)
    }

    get() {
        return null
    }

data class Typograph(
    val fontName: String,
    val fontSize: Float,
    val color: Color
)