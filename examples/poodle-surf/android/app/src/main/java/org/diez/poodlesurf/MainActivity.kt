package org.diez.poodlesurf

import android.graphics.Color
import org.diez.puente.Diez
import org.diez.components.DesignSystem
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*
import android.graphics.drawable.GradientDrawable

class MainActivity : AppCompatActivity() {
    val diez = Diez(DesignSystem())
    val gd = GradientDrawable(
        GradientDrawable.Orientation.TOP_BOTTOM,
        intArrayOf(Color.BLACK, Color.WHITE)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        gd.cornerRadius = 0f
        layout.background = gd
        diez.attach(layout, fun(component) {
            runOnUiThread {
                component.textStyles.headerTitle.setTextStyle(text)
                gd.colors = intArrayOf(component.palette.gradient.startColor, component.palette.gradient.endColor)
            }
        })
    }
}
