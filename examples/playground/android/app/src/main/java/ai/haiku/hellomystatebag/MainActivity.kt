package ai.haiku.hellomystatebag

import org.diez.puente.Diez
import org.diez.components.MyStateBag
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
                component.textStyle.setTextStyle(text)
                component.image.setBackground(view)
            }
        })
        // FIXME: Note how we must to do this *after* we've called diez.attach() at least once.
        // This is because the environment hasn't been correctly initialized yet.
        runOnUiThread {
            diez.component.haiku.embedHaiku(haikuSlot)
            diez.component.svg.embedSvg(ratSlot)
            diez.component.lottie.embedLottie(lottieSlot)
        }
    }
}
