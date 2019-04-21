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

data class Image(
    val file: File,
    val width: Int,
    val height: Int,
    val scale: Float
) {
    private fun displayWidth(context: Context): Int {
        return (width / scale * context.resources.displayMetrics.density).toInt()
    }

    private fun displayHeight(context: Context): Int {
        return (height/ scale * context.resources.displayMetrics.density).toInt()
    }

    private fun glide(context: Context): RequestBuilder<Drawable> {
        return Glide.with(context).load(file.uri())
    }

    fun setBackground(view: View) {
        // TODO: do not depend on Glide's optimizations to avoid reloading the image every time. Implement smart caching.
        glide(view.context).into(object : SimpleTarget<Drawable>(displayWidth(view.context), displayHeight(view.context)) {
            override fun onResourceReady(resource: Drawable, transition: Transition<in Drawable>?) {
                (resource as BitmapDrawable).setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
                view.background = resource
            }
        })
    }
}
