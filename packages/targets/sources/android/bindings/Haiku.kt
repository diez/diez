data class Haiku(val component: String) {
    private fun file(): File {
        return File("haiku/$component.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    fun embedHaiku(view: ViewGroup) {
        val webview = WebView(view.context)
        webview.setBackgroundColor(CoreColor.TRANSPARENT)
        webview.isVerticalScrollBarEnabled = false
        webview.isHorizontalScrollBarEnabled = false
        webview.settings.javaScriptEnabled = true
        webview.loadUrl(file().canonicalURL())
        view.addView(webview)
        webview.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        )
    }
}
