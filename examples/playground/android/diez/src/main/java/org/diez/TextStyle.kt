package org.diez

import java.io.File as CoreFile
import android.graphics.Typeface
import android.widget.TextView

data class TextStyle(val fontName: String, val fontSize: Float, @QualifiedColor val color: Color) {
    fun typeface(): Typeface {
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

    fun setTextStyle(view: TextView) {
        view.typeface = typeface()
        view.textSize = fontSize
        view.setTextColor(color)
    }
}
