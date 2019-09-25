package org.diez.examples.poodlesurfjava;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.drawable.PaintDrawable;
import android.graphics.drawable.shapes.RectShape;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;

import org.diez.poodleSurf.*;

public class MainActivity extends AppCompatActivity {
    private DesignSystem diez;
    private ModelMocks mocks;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        DesignSystem designSystem = new DesignSystem();

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

        View rootView = findViewById(R.id.root);
        int color = diez.getPalette().getBackground().getColor();
        rootView.setBackgroundColor(color);

        Image image = diez.getDesigns().getReport().getHeader().getMapPinIcon();

        ImageView imageView = findViewById(R.id.imageView);
        ImageKt.load(imageView, image);

        View backgroundImageView = findViewById(R.id.backgroundImageView);
        ImageKt.loadBackgroundImage(backgroundImageView, image);

        TextView textView = findViewById(R.id.textView);
        ImageKt.loadLeftDrawable(textView, image);

        Typograph typograph = diez.getTypographs().getHeaderTitle();
        TypographKt.apply(textView, typograph);

        LinearGradient linearGradient = diez.getPalette().getContentBackground();
        PaintDrawable drawable = new PaintDrawable();
        drawable.setShape(new RectShape());
        drawable.setShaderFactory(linearGradient.getShaderFactory());
        View gradientView = findViewById(R.id.gradientView);
        gradientView.setBackground(drawable);

        Lottie lottie = diez.getDesigns().getLoading().getAnimation();
        LottieAnimationView animationView = findViewById(R.id.animationView);
        LottieKt.load(animationView, lottie);

        Panel panel = diez.getDesigns().getReport().getSwell().getShared().getPanel();
        PanelView panelView = findViewById(R.id.panelView);
        panelView.apply(panel);
    }

    private void onMocksUpdated () {
        System.out.println("======== Mocks updated ===========");
        System.out.println(mocks);
    }
}
