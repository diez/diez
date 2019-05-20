import android.content.Context
import android.graphics.Color
import android.util.AttributeSet
import android.webkit.WebView

class SVGView(context: Context, attrs: AttributeSet) : WebView(context, attrs) {
    init {
        this.setBackgroundColor(Color.TRANSPARENT)
        this.isVerticalScrollBarEnabled = false
        this.isHorizontalScrollBarEnabled = false
    }

    fun load(svg: SVG) {
        val file = File("${svg.src}.html")
        this.loadUrl(file.websafeURL)
    }
}
