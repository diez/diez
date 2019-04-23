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
}

class Diez<T : StateBag>(var component: T, val view: ViewGroup) {
    val adapter : JsonAdapter<T>
    val subscribers = mutableListOf<(T) -> Unit>()

    init {
        val builder = Builder()
        builder.add(KotlinJsonAdapterFactory())
        adapter = builder.build().adapter(component.javaClass)
        Environment.initialize(view.context.resources)
        if (Environment.isDevelopment) {
            val webview = WebView(view.context)
            webview.settings.javaScriptEnabled = true
            webview.addJavascriptInterface(this, "puente")
            webview.loadUrl("${Environment.serverUrl}components/${component.name}")
            Log.d("DIEZ", "Loading ${Environment.serverUrl}components/${component.name}")
            view.addView(webview, ViewGroup.LayoutParams(0, 0))
        }
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
    fun attach(subscriber: (T) -> Unit) {
        subscriber(component)
        subscribe(subscriber)
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
