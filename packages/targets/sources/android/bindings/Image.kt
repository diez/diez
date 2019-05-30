import android.graphics.BitmapFactory
import android.graphics.Shader
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.support.v7.widget.Toolbar
import android.view.View
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.SimpleTarget
import com.bumptech.glide.request.transition.Transition
import android.widget.ImageView
import android.widget.TextView

var ImageView.image: Image?
    set(image) {
        if (image == null) {
            return
        }

        if (Environment.isHot) {
            getFromNetwork(image, this, object : SimpleTarget<Drawable>() {
                override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                    setImageDrawable(drawable)
                }
            })
            return
        }

        setImageDrawable(image.drawableFromRawResource)
    }
    get() {
        return null
    }

var ImageView.file: File?
    set(file) {
        if (file == null) {
            return
        }

        if (Environment.isHot) {
            Glide.with(this.context).load(file.url).into(object : SimpleTarget<Drawable>() {
                override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                    setImageDrawable(drawable)
                }
            })
            return
        }

        setImageBitmap(BitmapFactory.decodeStream(resources.openRawResource(file.resourceId)))
    }
    get() {
        return null
    }

var TextView.leftDrawable: Image?
    set(image) {
        if (image == null) {
            return
        }

        if (Environment.isHot) {
            getFromNetwork(image, this, object : SimpleTarget<Drawable>() {
                override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                    setCompoundDrawablesWithIntrinsicBounds(drawable, null, null, null)
                }
            })
            return
        }

        setCompoundDrawablesWithIntrinsicBounds(image.drawableFromRawResource, null, null, null)
    }
    get() {
        return null
    }

var Toolbar.icon: Image?
    set(image) {
        if (image == null) {
            return
        }

        if (Environment.isHot) {
            getFromNetwork(image, this, object : SimpleTarget<Drawable>() {
                override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                    navigationIcon = drawable
                }
            })
            return
        }

        navigationIcon = image.drawableFromRawResource
    }
    get() {
        return null
    }

var View.backgroundImage : Image?
    set(image) {
        if (image == null) {
            return
        }

        if (Environment.isHot) {
            val view = this
            getFromNetwork(image, this, object : SimpleTarget<Drawable>() {
                override fun onResourceReady(drawable: Drawable, transition: Transition<in Drawable>?) {
                    (drawable as BitmapDrawable).setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
                    view.background = drawable
                }
            })
            return
        }

        val drawable = image.drawableFromRawResource
        (drawable as BitmapDrawable).setTileModeXY(Shader.TileMode.REPEAT, Shader.TileMode.REPEAT)
        this.background = drawable
    }
    get() {
        return null
    }

private val Image.correctDensityFile: File
    get () {
        val density = Environment.resources.displayMetrics.density.toDouble()
        return when (Math.ceil(density)) {
            1.0 -> file1x
            2.0 -> file2x
            else -> file3x
        }
    }

private val Image.resourceId: Int
    get () {
        return this.correctDensityFile.resourceId
    }

private fun getFromNetwork(image: Image, view: View, callback: SimpleTarget<Drawable>) {
    Glide.with(view.context).load(image.correctDensityFile.url).into(callback)
}


private val Image.drawableFromRawResource: Drawable?
    get () {
        return Drawable.createFromStream(Environment.resources.openRawResource(this.resourceId), null)
    }
