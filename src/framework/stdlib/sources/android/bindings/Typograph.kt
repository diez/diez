package {{{packageName}}}

import java.io.File as CoreFile
import android.graphics.Typeface
import android.widget.TextView
import java.io.BufferedInputStream
import java.io.FileOutputStream
import android.os.StrictMode
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.graphics.Paint

{{> androidDataClassStart }}

    val typeface: Typeface?
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

    val gravity: Int
        get() {
            return when (alignment) {
                "natural" -> Gravity.START
                "left" -> Gravity.LEFT
                "center" -> Gravity.CENTER_HORIZONTAL
                "right" -> Gravity.RIGHT
                else -> Gravity.START
            }
        }
}

fun TextView.apply(typograph: Typograph) {
    this.typeface = typograph.typeface
    val unit = if (typograph.shouldScale) TypedValue.COMPLEX_UNIT_SP else TypedValue.COMPLEX_UNIT_DIP
    this.setTextSize(unit, typograph.fontSize)
    this.setTextColor(typograph.color.color)
    this.letterSpacing = ((typograph.fontSize + typograph.letterSpacing) / typograph.fontSize) - 1
    this.gravity = typograph.gravity
    this.textAlignment = View.TEXT_ALIGNMENT_GRAVITY

    var paintFlags = this.paintFlags

    val hasUnderline = typograph.decoration.contains("underline")
    paintFlags = when(hasUnderline) {
        true -> paintFlags or Paint.UNDERLINE_TEXT_FLAG
        else -> paintFlags and Paint.UNDERLINE_TEXT_FLAG.inv()
    }

    val hasStrikethrough = typograph.decoration.contains("strikethrough")
    paintFlags = when(hasStrikethrough) {
        true -> paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
        else -> paintFlags and Paint.STRIKE_THRU_TEXT_FLAG.inv()
    }

    this.paintFlags = paintFlags

    // TODO: Test for `null` instead of a magic number.
    if (typograph.lineHeight != -1f) {
        val lineHeight = if (typograph.shouldScale) typograph.lineHeight.spToPxFloat() else typograph.lineHeight.dpToPxFloat()
        val fontHeight = this.paint.getFontMetrics(null)
        this.setLineSpacing(lineHeight - fontHeight, 1f)

        val fontMiddle = fontHeight / 2
        val lineHeightMiddle = lineHeight / 2

        val fontMetrics = this.paint.fontMetricsInt
        // fontMetrics.top and fontMetrics.ascent are negative values (y+ is downward). Invert to get the offset as a distance.
        val topOffset = maxOf(-fontMetrics.top, -fontMetrics.ascent)
        val bottomOffset = maxOf(fontMetrics.bottom, fontMetrics.descent)

        this.firstBaselineToTopHeight = (topOffset - fontMiddle + lineHeightMiddle).toInt()
        this.lastBaselineToBottomHeight = (bottomOffset - fontMiddle + lineHeightMiddle).toInt()
    } else {
        this.setLineSpacing(0f, 1f)
        this.firstBaselineToTopHeight = 0
        this.lastBaselineToBottomHeight = 0
    }
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
    try {
      connection.connect()
    } catch (e: Exception) {
        Log.e("DIEZ", e.toString())
        return
    }
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

private fun getTypeface(font: Font): Typeface? {
    if (Environment.isHot) {
        hotLoadFont(font)
        return foreignFontCache.get(font.name)
    }

    val typeface = Environment.resources.getFont(font.file.resourceId)
    foreignFontCache.set(font.name, typeface)
    return typeface
}
