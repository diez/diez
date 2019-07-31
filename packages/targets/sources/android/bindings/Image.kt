package {{{packageName}}}

import android.graphics.BitmapFactory
import android.graphics.Shader
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import androidx.core.content.res.ResourcesCompat
import androidx.appcompat.widget.Toolbar
import android.view.View
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.SimpleTarget
import com.bumptech.glide.request.transition.Transition
import com.bumptech.glide.signature.ObjectKey
import android.widget.ImageView
import android.widget.TextView
import kotlin.math.roundToInt

{{> androidDataClassStart }}

    internal val correctDensityFile: File
        get () {
            return when (effectiveDensity) {
                1 -> file
                2 -> file2x
                3 -> file3x
                else -> file4x
            }
        }

    internal val resourceId: Int
        get () {
            return this.correctDensityFile.resourceId
        }

    internal val drawableFromRawResource: Drawable?
        get () {
            return ResourcesCompat.getDrawable(
                Environment.resources,
                Environment.resources.getIdentifier(
                    file.resourceName,
                    "drawable",
                    Environment.packageName
                ),
                null
            )
        }
}

fun ImageView.load(image: Image) {
    if (Environment.isHot) {
        getFromNetwork(image, this, fun(drawable) {
            setImageDrawable(drawable)
        })
        return
    }

    setImageDrawable(image.drawableFromRawResource)
}

fun ImageView.load(file: File) {
    if (Environment.isHot) {
        Glide.with(this.context).load(file.url).signature(ObjectKey(file.src + System.currentTimeMillis())).into(object : SimpleTarget<Drawable>() {
            override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                setImageDrawable(drawable)
            }
        })
        return
    }

    setImageBitmap(BitmapFactory.decodeStream(resources.openRawResource(file.resourceId)))
}

fun TextView.loadLeftDrawable(image: Image) {
    if (Environment.isHot) {
        getFromNetwork(image, this, fun(drawable) {
            setCompoundDrawablesWithIntrinsicBounds(drawable, null, null, null)
        })
        return
    }

    setCompoundDrawablesWithIntrinsicBounds(image.drawableFromRawResource, null, null, null)
}

fun Toolbar.loadIcon(image: Image) {
    if (Environment.isHot) {
        getFromNetwork(image, this, fun(drawable) {
            navigationIcon = drawable
        })
        return
    }

    navigationIcon = image.drawableFromRawResource
}

fun View.loadBackgroundImage(image: Image) {
    if (Environment.isHot) {
        val view = this
        getFromNetwork(image, this, fun(drawable) {
            drawable.setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
            view.background = drawable
        })
        return
    }

    val drawable = image.drawableFromRawResource
    (drawable as BitmapDrawable).setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
    this.background = drawable
}

private val effectiveDensity: Int
    get () {
        val density = Environment.resources.displayMetrics.density.toDouble()
        return Math.ceil(density).toInt()
    }

private fun getFromNetwork(image: Image, view: View, callback: (BitmapDrawable) -> Unit) {
    val width = (image.size.width * Environment.resources.displayMetrics.density.toDouble()).roundToInt()
    val height = (image.size.height * Environment.resources.displayMetrics.density.toDouble()).roundToInt()
    Glide
        .with(view.context)
        .load(image.correctDensityFile.url)
        .override(width, height)
        .signature(ObjectKey(image.file.src + System.currentTimeMillis()))
        .into(object : SimpleTarget<Drawable>() {
        override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
            callback(drawable as BitmapDrawable)
        }
    })
}
