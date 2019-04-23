package org.diez

import android.content.Context
import android.graphics.Shader
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.view.View
import com.bumptech.glide.Glide
import com.bumptech.glide.RequestBuilder
import com.bumptech.glide.request.target.SimpleTarget
import com.bumptech.glide.request.transition.Transition
import android.net.Uri

fun Image.uri(density: Float): Uri? {
    return when (Math.round(density)) {
        1 -> file1x.uri
        2 -> file2x.uri
        3 -> file3x.uri
        else -> null
    }
}

private fun Image.glide(context: Context, scale: Float): RequestBuilder<Drawable>? {
    val uri = uri(scale)
    if (uri != null) {
        return Glide.with(context).load(uri)
    }

    return null
}

fun View.setBackgroundImage(image: Image) {
    val density = this.context.resources.displayMetrics.density
    val glide = image.glide(this.context, density)
    if (glide != null) {
        // TODO: do not depend on Glide's optimizations to avoid reloading the image every time. Implement smart caching.
        val view = this
        glide.into(object :
            SimpleTarget<Drawable>() {
            override fun onResourceReady(resource: Drawable, transition: Transition<in Drawable>?) {
                (resource as BitmapDrawable).setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
                view.background = resource
            }
        })
    }
}
