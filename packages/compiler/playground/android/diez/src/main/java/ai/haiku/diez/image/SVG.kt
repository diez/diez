package ai.haiku.diez.image

import ai.haiku.diez.file.File
import android.graphics.Color
import android.view.ViewGroup
import android.webkit.WebView

data class SVG(val file: File) {
    fun embedSvg(view: ViewGroup): WebView {
        val webview = WebView(view.context)
        webview.setBackgroundColor(Color.TRANSPARENT)
        webview.isVerticalScrollBarEnabled = false
        webview.isHorizontalScrollBarEnabled = false
        webview.loadUrl(file.canonicalURL())
        view.addView(webview)
        return webview
    }
}
