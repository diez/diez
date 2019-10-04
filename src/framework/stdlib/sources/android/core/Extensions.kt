package {{{packageName}}}

import android.content.res.Resources
import android.util.TypedValue

fun Number.dpToPxFloat(): Float {
    return TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP,
        this.toFloat(),
        Resources.getSystem().displayMetrics
    )
}

fun Number.dpToPx(): Int {
    return dpToPxFloat().toInt()
}

fun Number.spToPxFloat(): Float {
    return TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_SP,
        this.toFloat(),
        Resources.getSystem().displayMetrics
    )
}

fun Number.spToPx(): Int {
    return spToPxFloat().toInt()
}
