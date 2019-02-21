package ai.haiku.diez.image

import ai.haiku.diez.file.File
import android.graphics.Color
import android.view.ViewGroup
import android.webkit.WebView
import android.widget.FrameLayout

data class SVG(val file: File) {
    fun embedSvg(view: ViewGroup) {
        val webview = WebView(view.context)
        webview.setBackgroundColor(Color.TRANSPARENT)
        webview.isVerticalScrollBarEnabled = false
        webview.isHorizontalScrollBarEnabled = false
        webview.loadUrl(file.canonicalURL())
        view.addView(webview)
        webview.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        )
    }
}
