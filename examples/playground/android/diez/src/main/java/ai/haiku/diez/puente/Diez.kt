package ai.haiku.diez.puente

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.JavascriptInterface
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.squareup.moshi.Moshi.Builder

typealias Method = (String, Any?) -> Unit

interface StateBag {
    val adapters : List<Any>
    val name : String
    fun listen(listener: Method)
}

class Diez<T : StateBag>(var component: T) {
    val adapter : JsonAdapter<T>
    val subscribers = mutableListOf<(T) -> Unit>()
    lateinit var webview : WebView

    init {
        val builder = Builder()
        for (adapter in component.adapters) {
            builder.add(adapter)
        }
        builder.add(KotlinJsonAdapterFactory())
        adapter = builder.build().adapter(component.javaClass)
        component.listen(fun(eventName, _) {
            @Suppress("SENSELESS_COMPARISON")
            if (webview == null) {
                return
            }
            webview.evaluateJavascript("trigger('${eventName}')", null)
        })
    }

    @JavascriptInterface
    fun patch(json: String) {
        // TODO: update instead of replacing!!!
        component = adapter.fromJson(json)!!
        component.listen(fun(eventName, _) {
            @Suppress("SENSELESS_COMPARISON")
            if (webview == null) {
                return
            }
            webview.evaluateJavascript("trigger('${eventName}')", null)
        })
        broadcast()
    }

    @SuppressLint("SetJavaScriptEnabled")
    fun attach(view: ViewGroup, subscriber: (T) -> Unit) {
        Environment.initialize(view.context.resources)
        subscriber(component)
        webview = WebView(view.context)
        webview.settings.javaScriptEnabled = true
        webview.addJavascriptInterface(this, "puente")
        subscribe(subscriber)
        if (Environment.isDevelopment) {
            print("${Environment.serverUrl}/components/${component.name}")
            webview.loadUrl("${Environment.serverUrl}/components/${component.name}")
        } else {
            // TODO: where is this really?
            webview.loadUrl("file:///android_asset/index.html")
        }
        view.viewTreeObserver.addOnDrawListener(fun() {
            webview.evaluateJavascript("window.tick && window.tick(${System.currentTimeMillis()})", null)
            view.invalidate()
        })
        view.addView(webview, ViewGroup.LayoutParams(0, 0))
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
