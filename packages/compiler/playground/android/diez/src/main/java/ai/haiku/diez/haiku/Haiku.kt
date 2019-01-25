package ai.haiku.diez.haiku

import ai.haiku.diez.file.File
import android.view.ViewGroup
import android.webkit.WebView

data class Haiku(val file: File) {
    fun embedHaiku(view: ViewGroup): WebView {
        val webview = WebView(view.context)
        webview.settings.javaScriptEnabled = true
        webview.loadUrl(file.canonicalURL())
        view.addView(webview)
        return webview
    }
}
