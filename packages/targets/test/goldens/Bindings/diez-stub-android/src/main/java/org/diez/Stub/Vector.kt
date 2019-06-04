package org.diez.stub

import android.content.Context
import android.graphics.Color
import android.util.AttributeSet
import android.webkit.WebView

class VectorView(context: Context, attrs: AttributeSet) : WebView(context, attrs) {
    init {
        this.setBackgroundColor(Color.TRANSPARENT)
        this.isVerticalScrollBarEnabled = false
        this.isHorizontalScrollBarEnabled = false
    }

    fun load(vector: Vector) {
        val file = File("${vector.src}.html", "raw")
        this.loadUrl(file.websafeURL)
    }
}

data class Vector(
    val src: String
) {
    companion object {}
}
