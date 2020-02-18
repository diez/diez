// This file was generated with Diez - https://diez.org
// Do not edit this file directly.

package org.diez.stdlibTestStub

import android.util.Log
import android.widget.FrameLayout
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieCompositionFactory
import com.airbnb.lottie.LottieComposition
import com.airbnb.lottie.LottieListener
import com.airbnb.lottie.LottieDrawable

/**
 * Provides an abstraction for [Lottie](https://airbnb.io/lottie/#/) animations.
 *
 */
data class Lottie(
    /**
     * Lottie data.
     *
     * assets/lottie.json
     */
    val file: File,
    /**
     * Lottie data.
     *
     */
    val loop: Boolean,
    /**
     * Lottie data.
     *
     */
    val autoplay: Boolean
) {
    companion object {}
}

fun LottieAnimationView.load(lottie: Lottie) {
    val task = when(Environment.isHot) {
        true -> LottieCompositionFactory.fromUrl(context, lottie.file.canonicalURL)
        else -> LottieCompositionFactory.fromRawRes(context, lottie.file.resourceId)
    }
    val lottieView = this
    task.addListener(object: LottieListener<LottieComposition> {
        override fun onResult(result: LottieComposition) {
            lottieView.repeatCount = if (lottie.loop) LottieDrawable.INFINITE else 0
            lottieView.setComposition(result)
            if (lottie.autoplay) {
              lottieView.playAnimation()
            }
        }
    })

    task.addFailureListener(object: LottieListener<Throwable> {
        override fun onResult(result: Throwable) {
            Log.e("DIEZ", "Lottie animation load for ${lottie.file.src} failed")
        }
    })
}
