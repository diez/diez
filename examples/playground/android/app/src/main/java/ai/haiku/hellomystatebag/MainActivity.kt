package ai.haiku.hellomystatebag

import org.diez.playground.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Diez(MyStateBag(), layout).attach(fun(component) {
            runOnUiThread {
                text.text = component.text
                text.typograph = component.typograph
                view.backgroundImage = component.image
                this.haikuView.load(component.haiku)
                this.vectorView.load(component.svg)
                this.lottieView.load(component.lottie)
            }
        })
    }
}
