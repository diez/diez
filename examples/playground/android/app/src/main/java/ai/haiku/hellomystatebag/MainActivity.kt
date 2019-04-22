package ai.haiku.hellomystatebag

import org.diez.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    val diez = Diez(MyStateBag())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        diez.attach(layout, fun(component) {
            runOnUiThread {
                text.text = component.copy
                text.setTextStyle(component.textStyle)
                view.setBackgroundImage(component.image)
                this.haikuView.load(component.haiku)
                this.svgView.load(component.svg)
                this.lottieView.load(component.lottie)
            }
        })
    }
}
