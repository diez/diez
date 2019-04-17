package org.diez.lottie

import android.util.Log
import org.diez.file.File
import android.view.ViewGroup
import android.widget.FrameLayout
import com.airbnb.lottie.*

data class Lottie(val file: File) {
    fun embedLottie(view: ViewGroup) {
        val task = LottieCompositionFactory.fromUrl(view.context, file.canonicalURL())
        task.addListener(object: LottieListener<LottieComposition> {
            override fun onResult(result: LottieComposition) {
                val lottieView = LottieAnimationView(view.context)
                // TODO: configuration "loop".
                lottieView.repeatCount = LottieDrawable.INFINITE
                lottieView.setComposition(result)
                // TODO: configuration "autoplay".
                lottieView.playAnimation()
                view.addView(lottieView)
                lottieView.layoutParams = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
                )
            }
        })

        task.addFailureListener(object: LottieListener<Throwable> {
            override fun onResult(result: Throwable) {
                Log.e("DIEZ", "Lottie animation load for ${file.src} failed")
            }
        })
    }
}
