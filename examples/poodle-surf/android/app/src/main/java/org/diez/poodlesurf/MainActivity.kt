package org.diez.poodlesurf

import org.diez.puente.Diez
import org.diez.components.MyStateBag
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    val diez = Diez(MyStateBag())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        diez.attach(layout, fun(component) {
            Log.e("DIEZ", "hello world")
            Log.e("DIEZ", component.copy)
        })
    }
}
