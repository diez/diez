package {{{packageName}}}

import android.annotation.SuppressLint
import android.util.Log
import android.view.ViewGroup
import android.webkit.*
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.squareup.moshi.Moshi.Builder

interface RootComponent {
    val name : String
}

@SuppressLint("SetJavaScriptEnabled")
class Diez<T : RootComponent>(var component: T, val view: ViewGroup) {
    val adapter : JsonAdapter<T>
    val subscribers = mutableListOf<(T) -> Unit>()

    init {
        val builder = Builder()
        builder.add(KotlinJsonAdapterFactory())
        adapter = builder.build().adapter(component.javaClass)
        Environment.setContext(view.context)
        if (Environment.isHot) {
            // Enables webview debugging in chrome://inspect.
            WebView.setWebContentsDebuggingEnabled(true)
            val webview = WebView(view.context)
            // Allows `window.location.reload()` to behave as expected.
            webview.webViewClient = WebViewClient()
            webview.settings.javaScriptEnabled = true
            webview.addJavascriptInterface(this, "puente")
            webview.loadUrl("${Environment.serverUrl}/components/${component.name}")
            Log.d("DIEZ", "Loading ${Environment.serverUrl}/components/${component.name}")
            webview.alpha = 0F
            view.addView(webview, 0, 0)
        }
    }

    @JavascriptInterface
    fun patch(json: String) {
        try {
            component = adapter.fromJson(json)!!
            broadcast()
        } catch (e: Exception) {
            Log.e("DIEZ", e.toString())
        }
    }

    fun attach(subscriber: (T) -> Unit) {
        subscriber(component)
        if (Environment.isHot) {
            subscribe(subscriber)
        }
    }

    fun subscribe(subscriber: (T) -> Unit) {
        subscribers.add(subscriber)
    }

    fun broadcast() {
        for (subscriber in subscribers) {
            subscriber(component)
        }
    }
}
