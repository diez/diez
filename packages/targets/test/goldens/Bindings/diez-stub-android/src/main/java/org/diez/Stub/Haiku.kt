package org.diez.stub

import android.content.Context
import android.graphics.Color
import android.util.AttributeSet
import android.webkit.WebView

private val Haiku.file: File
    get() {
        return File("haiku/$component.html", "raw")
    }

class HaikuView(context: Context, attrs: AttributeSet) : WebView(context, attrs) {
    init {
        this.setBackgroundColor(Color.TRANSPARENT)
        this.isVerticalScrollBarEnabled = false
        this.isHorizontalScrollBarEnabled = false
        this.settings.javaScriptEnabled = true
    }

    fun load(haiku: Haiku) {
        this.loadUrl(haiku.file.websafeURL)
    }
}

data class Haiku(
    val component: String,
    val loop: Boolean,
    val autoplay: Boolean
) {
    companion object {}
}
