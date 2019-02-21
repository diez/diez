package ai.haiku.diez.lottie

import ai.haiku.diez.file.File
import android.view.ViewGroup
import android.widget.FrameLayout
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable

data class Lottie(val file: File) {
    fun embedLottie(view: ViewGroup) {
        val lottieView = LottieAnimationView(view.context)
        // TODO: configuration "loop".
        lottieView.repeatCount = LottieDrawable.INFINITE
        // TODO: configuration "autoplay".
        lottieView.playAnimation()
        lottieView.setAnimationFromUrl(file.canonicalURL())
        view.addView(lottieView)
        lottieView.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        )
    }
}
