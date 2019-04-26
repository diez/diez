package org.diez

import android.util.Log
import android.widget.FrameLayout
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieCompositionFactory
import com.airbnb.lottie.LottieComposition
import com.airbnb.lottie.LottieListener
import com.airbnb.lottie.LottieDrawable

fun LottieAnimationView.load(lottie: Lottie) {
    val task = when(Environment.isDevelopment) {
        true -> LottieCompositionFactory.fromUrl(context, lottie.file.canonicalURL)
        else -> LottieCompositionFactory.fromRawRes(context, lottie.file.resourceId)
    }
    val lottieView = this
    task.addListener(object: LottieListener<LottieComposition> {
        override fun onResult(result: LottieComposition) {
            // TODO: configuration "loop".
            lottieView.repeatCount = LottieDrawable.INFINITE
            lottieView.setComposition(result)
            // TODO: configuration "autoplay".
            lottieView.playAnimation()
            lottieView.layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
    })

    task.addFailureListener(object: LottieListener<Throwable> {
        override fun onResult(result: Throwable) {
            Log.e("DIEZ", "Lottie animation load for ${lottie.file.src} failed")
        }
    })
}
