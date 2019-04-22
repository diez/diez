package org.diez

import java.io.File as CoreFile
import android.graphics.Typeface
import android.widget.TextView

val TextStyle.typeface: Typeface
    get() {
        if (foreignFontCache.containsKey(fontName)) {
            return foreignFontCache.get(fontName)!!
        }

        if (systemFontCache.isEmpty()) {
            FontRegistry.registerSystemFonts()
        }

        if (systemFontCache.containsKey(fontName)) {
            val resolver = systemFontCache.get(fontName)!!
            val typeface = Typeface.create(Typeface.create(resolver.name, Typeface.NORMAL), resolver.weight, resolver.isItalic)
            foreignFontCache.set(fontName, typeface)
            return typeface
        }

        // Just use the system default.
        return Typeface.create(null, 500, false)
    }

fun TextView.setTextStyle(textStyle: TextStyle) {
    this.typeface = textStyle.typeface
    this.textSize = textStyle.fontSize
    this.setTextColor(textStyle.color.color)
}
