package org.diez.examples.poodlesurfjava;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import org.diez.poodleSurf.*;

public class MainActivity extends AppCompatActivity {
    private DesignSystem diez;
    private ModelMocks mocks;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        new Diez<>(new DesignSystem(), findViewById(android.R.id.content)).attach((DesignSystem component) -> {
            runOnUiThread(() -> {
                diez = component;
                onDiezUpdated();
            });

            return null;
        });

        new Diez<>(new ModelMocks(), findViewById(android.R.id.content)).attach((ModelMocks component) -> {
            runOnUiThread(() -> {
                mocks = component;
                onMocksUpdated();
            });

            return null;
        });
    }

    private void onDiezUpdated () {
        System.out.println("======== DS updated ===========");
        System.out.println(diez);

    }

    private void onMocksUpdated () {
        System.out.println("======== Mocks updated ===========");
        System.out.println(mocks);
    }
}
