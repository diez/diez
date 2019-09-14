package {{{packageName}}}

import android.graphics.Color as CoreColor
import androidx.core.graphics.ColorUtils

{{> androidDataClassStart }}

    val color: Int
        get() {
            val rgb = ColorUtils.HSLToColor(floatArrayOf(this.h * 360, this.s, this.l))
            return CoreColor.argb(
                (this.a * 255).toInt(),
                CoreColor.red(rgb),
                CoreColor.green(rgb),
                CoreColor.blue(rgb)
            )
        }
}
