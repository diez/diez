package ai.haiku.hellomystatebag

import ai.haiku.diez.puente.Diez
import ai.haiku.diez.components.MyStateBag
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.MotionEvent
import android.widget.FrameLayout
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    val diez = Diez(MyStateBag())
    var embeddedHaikuOnce = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        diez.attach(layout, fun(component) {
            runOnUiThread {
                text.text = component.copy
                component.textStyle.setTextStyle(text)
                component.image.setBackground(view)
                if (!embeddedHaikuOnce) {
                    embeddedHaikuOnce = true
                    val layoutParams = FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                    )
                    val haikuWebview = component.haiku.embedHaiku(haikuSlot)
                    val svgWebview = component.svg.embedSvg(ratSlot)
                    haikuWebview.layoutParams = layoutParams
                    svgWebview.layoutParams = layoutParams
                }
            }
        })
    }

    override fun onTouchEvent(e: MotionEvent): Boolean {
        if (e.action == MotionEvent.ACTION_DOWN) {
            diez.component.tap()
        }
        return true
    }
}
