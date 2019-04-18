data class SVG(val src: String) {
    fun embedSvg(view: ViewGroup) {
        val file = File("$src.html")
        val webview = WebView(view.context)
        webview.setBackgroundColor(CoreColor.TRANSPARENT)
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
