package org.diez.examples.poodlesurf

import android.graphics.Color
import org.diez.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*
import android.graphics.drawable.GradientDrawable

class MainActivity : AppCompatActivity() {
    val gd = GradientDrawable(
        GradientDrawable.Orientation.TOP_BOTTOM,
        intArrayOf(Color.BLACK, Color.WHITE)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        gd.cornerRadius = 0f
        layout.background = gd
        Diez(DesignSystem(), layout).attach(fun(component) {
            runOnUiThread {
                text.setTextStyle(component.textStyles.headerTitle)
                gd.colors = intArrayOf(component.palette.gradient.startColor.color, component.palette.gradient.endColor.color)
            }
        })
    }
}
