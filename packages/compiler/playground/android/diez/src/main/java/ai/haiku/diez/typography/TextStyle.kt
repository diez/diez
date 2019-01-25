package ai.haiku.diez.typography

import ai.haiku.diez.color.Color
import ai.haiku.diez.color.QualifiedColor
import java.io.File as CoreFile
import ai.haiku.diez.file.File
import android.graphics.Typeface
import android.widget.TextView
import com.jaredrummler.truetypeparser.TTFFile
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.io.BufferedInputStream
import java.io.FileOutputStream
import java.lang.Exception

private data class FontResolver(val name: String, val weight: Int, val isItalic: Boolean)

private val tempPrefix = "diez-fonts"
private val tempSuffix = ".ttf"
private val foreignFontCache = HashMap<String, Typeface>()
private val systemFontCache = HashMap<String, FontResolver>()
private val fontSrcCache: MutableSet<String> = mutableSetOf()

class FontRegistry(val files: Array<File>) {
    companion object {
        fun registerSystemFonts() {
            // Hack: pre-register system fonts.
            systemFontCache.set("Roboto-Thin", FontResolver("sans-serif", 100, false))
            systemFontCache.set("Roboto-ThinItalic", FontResolver("sans-serif", 100, true))
            systemFontCache.set("Roboto-Light", FontResolver("sans-serif", 300, false))
            systemFontCache.set("Roboto-LightItalic", FontResolver("sans-serif", 300, true))
            systemFontCache.set("Roboto-Regular", FontResolver("sans-serif", 400, false))
            systemFontCache.set("Roboto-Italic", FontResolver("sans-serif", 400, true))
            systemFontCache.set("Roboto-Medium", FontResolver("sans-serif", 500, false))
            systemFontCache.set("Roboto-MediumItalic", FontResolver("sans-serif", 500, true))
            systemFontCache.set("Roboto-Black", FontResolver("sans-serif", 900, false))
            systemFontCache.set("Roboto-BlackItalic", FontResolver("sans-serif", 900, true))
            systemFontCache.set("Roboto-Bold", FontResolver("sans-serif", 700, false))
            systemFontCache.set("Roboto-BoldItalic", FontResolver("sans-serif", 700, true))
            systemFontCache.set("RobotoCondensed-Light", FontResolver("sans-serif-condensed", 300, false))
            systemFontCache.set("RobotoCondensed-LightItalic", FontResolver("sans-serif-condensed", 300, true))
            systemFontCache.set("RobotoCondensed-Regular", FontResolver("sans-serif-condensed", 400, false))
            systemFontCache.set("RobotoCondensed-Italic", FontResolver("sans-serif-condensed", 400, true))
            systemFontCache.set("RobotoCondensed-Medium", FontResolver("sans-serif-condensed", 500, false))
            systemFontCache.set("RobotoCondensed-MediumItalic", FontResolver("sans-serif-condensed", 500, true))
            systemFontCache.set("RobotoCondensed-Bold", FontResolver("sans-serif-condensed", 700, false))
            systemFontCache.set("RobotoCondensed-BoldItalic", FontResolver("sans-serif-condensed", 700, true))
            systemFontCache.set("NotoSerif-Regular", FontResolver("serif", 400, false))
            systemFontCache.set("NotoSerif-Bold", FontResolver("serif", 700, false))
            systemFontCache.set("NotoSerif-Italic", FontResolver("serif", 400, true))
            systemFontCache.set("NotoSerif-BoldItalic", FontResolver("serif", 700, true))
            systemFontCache.set("DroidSansMono", FontResolver("monospace", 400, false))
            systemFontCache.set("CutiveMono", FontResolver("serif-monospace", 400, false))
            systemFontCache.set("ComingSoon", FontResolver("casual", 400, false))
            systemFontCache.set("DancingScript-Regular", FontResolver("cursive", 400, false))
            systemFontCache.set("DancingScript-Bold", FontResolver("cursive", 700, false))
            systemFontCache.set("CarroisGothicSC-Regular", FontResolver("sans-serif-smallcaps", 400, false))
        }
    }

    init {
        registerFonts()
    }

    private fun registerFonts() {
        // TODO: maintain a global font registry, and only register new fonts
        files.forEach {
            // Do not reload the font file from this URL.
            if (fontSrcCache.contains(it.src)) {
                return
            }

            fontSrcCache.add(it.src)
            GlobalScope.launch {
                try {
                    val tempFile = CoreFile.createTempFile(tempPrefix, tempSuffix)
                    val url = it.url()
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
                    val ttf = TTFFile.open(tempFile)
                    foreignFontCache.set(ttf.postScriptName, Typeface.createFromFile(tempFile))
                } catch (e: Exception) {
                    // ...
                }
            }
        }
    }
}

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
