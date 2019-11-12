package org.diez.examples.loremipsum

import android.content.res.Resources
import android.graphics.drawable.PaintDrawable
import android.graphics.drawable.shapes.RectShape
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.TypedValue
import kotlinx.android.synthetic.main.activity_main.*
import org.diez.loremIpsum.*
import android.view.ViewTreeObserver.OnGlobalLayoutListener
import android.view.View

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Here we are observing hot updates to our design language.
        //
        // Since this instance of Diez is initialized with a DesignLanguage, it will deliver updates to the DesignLanguage
        // object described in `src/DesignLanguage.ts` (relative to the root of the Diez project).
        Diez(DesignLanguage(), root).attach(fun(designLanguage) {
            runOnUiThread {
                apply(designLanguage)
            }
        })
    }

    private fun apply(designLanguage: DesignLanguage) {
        root.setBackgroundColor(designLanguage.palette.contentBackground.color)

        headerLayout.background = backgroundFromGradient(designLanguage.palette.headerBackground)

        headerView.loadBackgroundImage(designLanguage.images.masthead)

        imageView.load(designLanguage.images.logo)

        imageView.afterLayout {
            val paddingBottom = -imageView.width / 2
            imageView.setPadding(designLanguage.layoutValues.contentMargin.left.dpToPx(), 0, 0, paddingBottom)
        }

        val padding = designLanguage.layoutValues.contentMargin
        contentLayout.setPadding(padding.left.dpToPx(), padding.top.dpToPx(), padding.right.dpToPx(), padding.bottom.dpToPx())

        titleTextView.text = designLanguage.strings.title
        titleTextView.apply(designLanguage.typography.heading1)
        titleSpacer.layoutParams.height = designLanguage.layoutValues.spacingSmall.dpToPx()

        captionTextView.text = designLanguage.strings.caption
        captionTextView.apply(designLanguage.typography.caption)
        captionSpacer.layoutParams.height = designLanguage.layoutValues.spacingSmall.dpToPx()

        animationView.load(designLanguage.loadingAnimation)
        animationSpacer.layoutParams.height = designLanguage.layoutValues.spacingMedium.dpToPx()

        animationTextView.text = designLanguage.strings.helper
        animationTextView.apply(designLanguage.typography.body)
    }

    private fun backgroundFromGradient(gradient: LinearGradient): PaintDrawable {
        val drawable = PaintDrawable()
        drawable.shape = RectShape()
        drawable.shaderFactory = gradient.shaderFactory
        return drawable
    }

    inline private fun View.afterLayout(crossinline afterLayout: () -> Unit) {
        viewTreeObserver.addOnGlobalLayoutListener(object : OnGlobalLayoutListener {
            override fun onGlobalLayout() {
                if (measuredWidth <= 0 || measuredHeight <= 0) {
                    return
                }

                viewTreeObserver.removeOnGlobalLayoutListener(this)
                afterLayout()
            }
        })
    }
}
