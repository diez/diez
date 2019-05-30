package org.diez.examples.loremipsum

import android.content.res.Resources
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.TypedValue
import kotlinx.android.synthetic.main.activity_main.*
import org.diez.loremIpsum.*
import android.view.ViewTreeObserver.OnGlobalLayoutListener
import android.view.ViewTreeObserver
import android.view.View

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val designSystem = DesignSystem()

        // TODO: Remove
        // Without calling this it will currently crash
        Diez(designSystem, layout)

        layout.setBackgroundColor(designSystem.colors.lightBackground.color)

        headerLayout.setBackgroundColor(designSystem.colors.darkBackground.color)

        headerView.backgroundImage = designSystem.images.masthead

        imageView.image = designSystem.images.logo

        imageView.afterLayout {
            val paddingBottom = -imageView.width / 2
            imageView.setPadding(designSystem.layoutValues.contentMargin.left.toPx(), 0, 0, paddingBottom)
        }

        val padding = designSystem.layoutValues.contentMargin
        contentLayout.setPadding(padding.left.toPx(), padding.top.toPx(), padding.right.toPx(), padding.bottom.toPx())

        titleTextView.text = designSystem.strings.title
        titleTextView.typograph = designSystem.typographs.heading1
        titleSpacer.layoutParams.height = designSystem.layoutValues.spacingSmall.toPx()

        captionTextView.text = designSystem.strings.caption
        captionTextView.typograph = designSystem.typographs.caption
        captionSpacer.layoutParams.height = designSystem.layoutValues.spacingSmall.toPx()

        animationView.load(designSystem.loadingAnimation)
    }

    // TODO: add to --target android core.
    fun Number.toPx(): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            Resources.getSystem().displayMetrics
        ).toInt()
    }

    inline fun View.afterLayout(crossinline afterLayout: () -> Unit) {
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
