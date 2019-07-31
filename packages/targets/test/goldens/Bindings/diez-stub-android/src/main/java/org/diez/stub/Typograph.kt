package org.diez.stub

import java.io.File as CoreFile
import android.graphics.Typeface
import android.widget.TextView
import java.io.BufferedInputStream
import java.io.FileOutputStream
import android.os.StrictMode

data class Typograph(
    val font: Font,
    val fontSize: Float,
    val color: Color
) {
    companion object {}

    val typeface: Typeface
        get() {
            if (foreignFontCache.containsKey(font.name)) {
                return foreignFontCache.get(font.name)!!
            }

            if (font.file.src == "") {
                if (systemFontCache.isEmpty()) {
                    registerSystemFonts()
                }

                if (systemFontCache.containsKey(font.name)) {
                    val resolver = systemFontCache.get(font.name)!!
                    val typeface = Typeface.create(
                        Typeface.create(resolver.name, resolver.style),
                        resolver.weight,
                        resolver.style == Typeface.ITALIC || resolver.style == Typeface.BOLD_ITALIC
                    )
                    foreignFontCache.set(font.name, typeface)
                    return typeface
                }


                return Typeface.create("", Typeface.NORMAL)
            }

            return getTypeface(font)
        }
}

fun TextView.apply(typograph: Typograph) {
    this.typeface = typograph.typeface
    this.textSize = typograph.fontSize
    this.setTextColor(typograph.color.color)
}

private data class FontResolver(val name: String, val weight: Int, val style: Int)

private val tempPrefix = "diez-fonts"
private val tempSuffix = ".ttf"
private val foreignFontCache = HashMap<String, Typeface>()
private val systemFontCache = HashMap<String, FontResolver>()
private val fontSrcCache: MutableSet<String> = mutableSetOf()

private fun registerSystemFonts() {
    systemFontCache.set("Roboto-Thin", FontResolver("sans-serif", 100, Typeface.NORMAL))
    systemFontCache.set("Roboto-ThinItalic", FontResolver("sans-serif", 100, Typeface.ITALIC))
    systemFontCache.set("Roboto-Light", FontResolver("sans-serif", 300, Typeface.NORMAL))
    systemFontCache.set("Roboto-LightItalic", FontResolver("sans-serif", 300, Typeface.ITALIC))
    systemFontCache.set("Roboto-Regular", FontResolver("sans-serif", 400, Typeface.NORMAL))
    systemFontCache.set("Roboto-Italic", FontResolver("sans-serif", 400, Typeface.ITALIC))
    systemFontCache.set("Roboto-Medium", FontResolver("sans-serif", 500, Typeface.NORMAL))
    systemFontCache.set("Roboto-MediumItalic", FontResolver("sans-serif", 500, Typeface.ITALIC))
    systemFontCache.set("Roboto-Black", FontResolver("sans-serif", 900, Typeface.BOLD))
    systemFontCache.set("Roboto-BlackItalic", FontResolver("sans-serif", 900, Typeface.BOLD_ITALIC))
    systemFontCache.set("Roboto-Bold", FontResolver("sans-serif", 700, Typeface.BOLD))
    systemFontCache.set("Roboto-BoldItalic", FontResolver("sans-serif", 700, Typeface.BOLD_ITALIC))
    systemFontCache.set(
        "RobotoCondensed-Light",
        FontResolver("sans-serif-condensed", 300, Typeface.NORMAL)
    )
    systemFontCache.set(
        "RobotoCondensed-LightItalic",
        FontResolver("sans-serif-condensed", 300, Typeface.ITALIC)
    )
    systemFontCache.set(
        "RobotoCondensed-Regular",
        FontResolver("sans-serif-condensed", 400, Typeface.NORMAL)
    )
    systemFontCache.set(
        "RobotoCondensed-Italic",
        FontResolver("sans-serif-condensed", 400, Typeface.ITALIC)
    )
    systemFontCache.set(
        "RobotoCondensed-Medium",
        FontResolver("sans-serif-condensed", 500, Typeface.NORMAL)
    )
    systemFontCache.set(
        "RobotoCondensed-MediumItalic",
        FontResolver("sans-serif-condensed", 500, Typeface.ITALIC)
    )
    systemFontCache.set(
        "RobotoCondensed-Bold",
        FontResolver("sans-serif-condensed", 700, Typeface.BOLD)
    )
    systemFontCache.set(
        "RobotoCondensed-BoldItalic",
        FontResolver("sans-serif-condensed", 700, Typeface.BOLD_ITALIC)
    )
    systemFontCache.set("NotoSerif-Regular", FontResolver("serif", 400, Typeface.NORMAL))
    systemFontCache.set("NotoSerif-Bold", FontResolver("serif", 700, Typeface.BOLD))
    systemFontCache.set("NotoSerif-Italic", FontResolver("serif", 400, Typeface.ITALIC))
    systemFontCache.set("NotoSerif-BoldItalic", FontResolver("serif", 700, Typeface.BOLD_ITALIC))
    systemFontCache.set("DroidSansMono", FontResolver("monospace", 400, Typeface.NORMAL))
    systemFontCache.set("CutiveMono", FontResolver("serif-monospace", 400, Typeface.NORMAL))
    systemFontCache.set("ComingSoon", FontResolver("casual", 400, Typeface.NORMAL))
    systemFontCache.set("DancingScript-Regular", FontResolver("cursive", 400, Typeface.NORMAL))
    systemFontCache.set("DancingScript-Bold", FontResolver("cursive", 700, Typeface.BOLD))
    systemFontCache.set(
        "CarroisGothicSC-Regular",
        FontResolver("sans-serif-smallcaps", 400, Typeface.NORMAL)
    )
}

private fun hotLoadFont(font: Font) {
    // Suspend the thread policy so we can load over the wire in the main thread synchronously.
    val oldThreadPolicy = StrictMode.getThreadPolicy()
    val policy = StrictMode.ThreadPolicy.Builder().permitAll().build()
    StrictMode.setThreadPolicy(policy)

    val tempFile = CoreFile.createTempFile(tempPrefix, tempSuffix)
    val url = font.file.url
    val connection = url.openConnection()
    connection.connect()
    val input = BufferedInputStream(url.openStream(), 8192)
    val output = FileOutputStream(tempFile)
    val data = ByteArray(1024)
    var count: Int
    while (true) {
        count = input.read(data)
        if (count == -1) {
            break
        }
        output.write(data, 0, count)
    }
    output.flush()
    output.close()
    input.close()
    foreignFontCache.set(font.name, Typeface.createFromFile(tempFile))
    StrictMode.setThreadPolicy(oldThreadPolicy)
}

private fun getTypeface(font: Font): Typeface {
    if (Environment.isHot) {
        hotLoadFont(font)
        return foreignFontCache.get(font.name)!!
    }

    val typeface = Environment.resources.getFont(font.file.resourceId)
    foreignFontCache.set(font.name, typeface)
    return typeface
}
