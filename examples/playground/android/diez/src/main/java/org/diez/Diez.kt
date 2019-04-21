package org.diez

import android.annotation.SuppressLint
import android.util.Log
import android.view.ViewGroup
import android.webkit.*
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.squareup.moshi.Moshi.Builder

interface StateBag {
    val name : String
    fun registerAdapters(builder: Builder)
}

class Diez<T : StateBag>(var component: T) {
    val adapter : JsonAdapter<T>
    val subscribers = mutableListOf<(T) -> Unit>()
    lateinit var webview : WebView

    init {
        val builder = Builder()
        component.registerAdapters(builder)
        builder.add(KotlinJsonAdapterFactory())
        adapter = builder.build().adapter(component.javaClass)
    }

    @JavascriptInterface
    fun patch(json: String) {
        // TODO: update instead of replacing!
        try {
            component = adapter.fromJson(json)!!
        } catch (e: Exception) {
            Log.e("DIEZ", e.toString())
        }
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
            webview.loadUrl("${Environment.serverUrl}components/${component.name}")
            Log.d("DIEZ", "Loading ${Environment.serverUrl}components/${component.name}")
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
