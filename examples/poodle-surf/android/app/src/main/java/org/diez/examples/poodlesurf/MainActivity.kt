package org.diez.examples.poodlesurf

import android.animation.Animator
import android.content.res.Resources
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import kotlinx.android.synthetic.main.activity_main.*
import org.diez.poodleSurf.*

class MainActivity : AppCompatActivity() {

    lateinit var diez: DesignSystem
    lateinit var mocks: ModelMocks

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Diez(DesignSystem(), root).attach(fun(component) {
            runOnUiThread {
                diez = component
                onDiezUpdated()
            }
        })

        // Attach mocks
        Diez(ModelMocks(), root).attach(fun(component) {
            runOnUiThread {
                mocks = component
                onMocksUpdated()
            }
        })
    }

    override fun onResume() {
        super.onResume()
        this.showSplash()
    }

    private fun onDiezUpdated() {
        applySplashScreenStyles()

        // Background color
        report.setBackgroundColor(diez.designs.report.backgroundColor.color)

        applyHeaderStyles()

        // Main Margins
        contentLayout.layoutParams = (contentLayout.layoutParams as LinearLayout.LayoutParams).apply {
            setMargin(diez.designs.report.contentLayoutMargins)
        }

        applyTemperatureCardStyles()

        applyWindCardStyles()

        applySwellCardStyles()

        applyTideCardStyles()
    }

    private fun applySplashScreenStyles() {
        // LoadingDesign
        loadingBackground.setBackgroundColor(diez.designs.loading.backgroundColor.color)
        lottie.addAnimatorListener(animationListener)
        lottie.load(diez.designs.loading.animation)
    }

    private fun applyHeaderStyles() {

        // NavigationTitle
        toolbar.setBackgroundColor(diez.designs.navigationTitle.barTintColor.color)
        toolbar.icon = diez.designs.navigationTitle.icon
        toolbar.contentInsetStartWithNavigation = diez.designs.navigationTitle.iconToTitleSpacing.toPx()
        toolbarTitle.text = diez.designs.navigationTitle.title
        toolbarTitle.typograph = diez.designs.navigationTitle.typograph

        // Header > Banner
        // TODO: write an extension
        bannerImage.layoutParams = (bannerImage.layoutParams as FrameLayout.LayoutParams).apply {
            width = FrameLayout.LayoutParams.MATCH_PARENT
            height = diez.designs.report.header.bannerHeight.toPx()
        }

        // Header > LocationImage (Circle Image)
        locationImage.borderColor = diez.designs.report.header.locationImage.strokeGradient.startColor.color
        locationImage.borderWidth = diez.designs.report.header.locationImage.strokeWidth.toPx()
        locationImage.layoutParams = (locationImage.layoutParams as FrameLayout.LayoutParams).apply {
            width = diez.designs.report.header.locationImage.widthAndHeight.toPx()
            height = diez.designs.report.header.locationImage.widthAndHeight.toPx()
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin =
                ((diez.designs.report.header.bannerHeight - (diez.designs.report.header.locationImage.widthAndHeight / 2))).toPx()
        }

        // Header > Labels + Text
        regionLabel.typograph = diez.designs.report.header.regionLabel
        placeLabel.typograph = diez.designs.report.header.placeLabel
        placeLabel.leftDrawable = diez.designs.report.header.mapPinIcon
        placeLabel.compoundDrawablePadding = diez.designs.report.header.pinIconToLabelSpacing.toPx()
        regionLabel.layoutParams = (regionLabel.layoutParams as LinearLayout.LayoutParams).apply {
            bottomMargin = diez.designs.report.header.labelsSpacing.toPx()
        }
        labelsLayout.layoutParams = (labelsLayout.layoutParams as LinearLayout.LayoutParams).apply {
            setMargin(diez.designs.report.header.labelsLayoutMargin)
        }
    }

    private fun applyDividerStyles(divider: View, cardDesign: ForecastCardDesign) {
        divider.setBackgroundColor(cardDesign.separatorColor.color)
        divider.layoutParams = (divider.layoutParams as LinearLayout.LayoutParams).apply {
            this.width = cardDesign.separatorWidth.toPx()
        }
    }

    private fun applySharedCardStyles(
        shared: SharedCardDesign,
        cardRoot: LinearLayout,
        cardTitle: TextView
    ) {
        val gradient = diez.palette.gradient

        cardRoot.setPadding(
            shared.layoutMargins.left.toPx(),
            shared.layoutMargins.top.toPx(),
            shared.layoutMargins.right.toPx(),
            shared.layoutMargins.bottom.toPx()
        )
        cardRoot.layoutParams = (cardRoot.layoutParams as LinearLayout.LayoutParams).apply {
            bottomMargin = diez.designs.report.contentSpacing.toPx()
        }

        cardRoot.background = GradientDrawable(
            getOrientation(gradient),
            intArrayOf(gradient.startColor.color, gradient.endColor.color)
        ).apply {
            cornerRadius = shared.cornerRadius.toPx().toFloat()
        }

        cardTitle.text = shared.title
        cardTitle.typograph = shared.titleTypograph
        cardTitle.layoutParams = (cardTitle.layoutParams as LinearLayout.LayoutParams).apply {
            bottomMargin = shared.titleContentSpacing.toPx()
        }
    }

    private fun applyTemperatureCardStyles() {
        // Card > Temperature
        applySharedCardStyles(diez.designs.report.waterTemperature.shared, temperatureCard, temperatureCardTitle)
        tempCardIcon.image = diez.designs.report.waterTemperature.temperature.icon
        tempCardIcon.setPadding(0, 0, diez.designs.report.waterTemperature.temperature.iconSpacing.toPx(), 0)
        tempCardTempText.typograph = diez.designs.report.waterTemperature.temperature.typograph
        wetsuitIcon.image = diez.designs.report.waterTemperature.wetsuit.icon
        wetsuitIcon.setPadding(0, 0, diez.designs.report.waterTemperature.wetsuit.iconSpacing.toPx(), 0)
        wetsuitLabel.typograph = diez.designs.report.waterTemperature.wetsuit.headerTypograph
        wetsuitLabel.text = diez.designs.report.waterTemperature.wetsuit.headerText
        wetsuitLabel.setPadding(0, 0, 0, diez.designs.report.waterTemperature.wetsuit.labelSpacing.toPx())
        wetsuitValue.typograph = diez.designs.report.waterTemperature.wetsuit.valueTypograph
    }


    private fun applyDayPartStyles(
        cardDesign: ForecastCardDesign,
        dayPartRoot: LinearLayout,
        valueUnit: LinearLayout,
        icon: ImageView?,
        value: TextView,
        unit: TextView,
        time: TextView
    ) {
        icon?.layoutParams = (icon?.layoutParams as LinearLayout.LayoutParams).apply {
            width = cardDesign.dayPart.iconWidth.toPx()
            height = cardDesign.dayPart.iconHeight.toPx()
        }

        valueUnit.setPadding(0, 0, 0, cardDesign.dayPartVerticalSpacing.toPx())

        time.typograph = cardDesign.dayPart.timeTypograph
        unit.typograph = cardDesign.dayPart.unitTypograph
        value.typograph = cardDesign.dayPart.valueTypograph
        value.setPadding(0, 0, cardDesign.dayPart.valueUnitSpacing.toPx(), 0)

        dayPartRoot.setPadding(
            cardDesign.dayPartsHorizontalSpacing.toPx(),
            0,
            cardDesign.dayPartsHorizontalSpacing.toPx(),
            0
        )

        unit.text = cardDesign.unit

        valueUnit.layoutParams = (valueUnit.layoutParams as LinearLayout.LayoutParams).apply {
            setMargin(cardDesign.valueUnitMargins)
        }
    }


    private fun applyWindCardStyles() {
        // Card > Wind
        applySharedCardStyles(diez.designs.report.wind.shared, windCard, windCardTitle)
        applyDayPartStyles(
            diez.designs.report.wind,
            windEarly,
            windEarlyValueUnit,
            windEarlyIcon,
            windEarlyValue,
            windEarlyUnit,
            windEarlyTime
        )
        applyDayPartStyles(
            diez.designs.report.wind,
            windMiddle,
            windMiddleValueUnit,
            windMiddleIcon,
            windMiddleValue,
            windMiddleUnit,
            windMiddleTime
        )
        applyDayPartStyles(
            diez.designs.report.wind,
            windLate,
            windLateValueUnit,
            windLateIcon,
            windLateValue,
            windLateUnit,
            windLateTime
        )
        applyDividerStyles(earlyDivider, diez.designs.report.wind)
        applyDividerStyles(middleDivider, diez.designs.report.wind)
    }


    private fun applySwellCardStyles() {
        // Card > Swell
        applySharedCardStyles(diez.designs.report.swell.shared, swellCard, swellCardTitle)
        applyDayPartStyles(
            diez.designs.report.swell,
            swellEarly,
            swellEarlyValueUnit,
            null,
            swellEarlyValue,
            swellEarlyUnit,
            swellEarlyTime
        )
        applyDayPartStyles(
            diez.designs.report.swell,
            swellMiddle,
            swellMiddleValueUnit,
            null,
            swellMiddleValue,
            swellMiddleUnit,
            swellMiddleTime
        )
        applyDayPartStyles(
            diez.designs.report.swell,
            swellLate,
            swellLateValueUnit,
            null,
            swellLateValue,
            swellLateUnit,
            swellLateTime
        )
        applyDividerStyles(swellEarlyDivider, diez.designs.report.swell)
        applyDividerStyles(swellMiddleDivider, diez.designs.report.swell)
    }


    private fun applyTideCardStyles() {
        // Card > Tide
        applySharedCardStyles(diez.designs.report.tide.shared, tideCard, tideCardTitle)
        applyDayPartStyles(
            diez.designs.report.tide,
            tideEarly,
            tideEarlyValueUnit,
            null,
            tideEarlyValue,
            tideEarlyUnit,
            tideEarlyTime
        )
        applyDayPartStyles(
            diez.designs.report.tide,
            tideMiddle,
            tideMiddleValueUnit,
            null,
            tideMiddleValue,
            tideMiddleUnit,
            tideMiddleTime
        )
        applyDayPartStyles(
            diez.designs.report.tide,
            tideLate,
            tideLateValueUnit,
            null,
            tideLateValue,
            tideLateUnit,
            tideLateTime
        )
        applyDividerStyles(tideEarlyDivider, diez.designs.report.tide)
        applyDividerStyles(tideMiddleDivider, diez.designs.report.tide)
    }

    private fun onMocksUpdated() {
        bannerImage.file = mocks.report.location.bannerImage
        locationImage.file = mocks.report.location.mapImage
        regionLabel.text = mocks.report.location.region
        placeLabel.text = mocks.report.location.place
        tempCardTempText.text = mocks.report.temperature.value
        wetsuitValue.text = mocks.report.temperature.gear

        windEarlyTime.text = mocks.report.wind.early.dayPart
        windEarlyIcon.file = mocks.report.wind.early.direction
        windEarlyValue.text = mocks.report.wind.early.value
        windMiddleTime.text = mocks.report.wind.middle.dayPart
        windMiddleIcon.file = mocks.report.wind.middle.direction
        windMiddleValue.text = mocks.report.wind.middle.value
        windLateTime.text = mocks.report.wind.late.dayPart
        windLateIcon.file = mocks.report.wind.late.direction
        windLateValue.text = mocks.report.wind.late.value

        swellEarlyTime.text = mocks.report.swell.early.dayPart
        swellEarlyValue.text = mocks.report.swell.early.value
        swellMiddleTime.text = mocks.report.swell.middle.dayPart
        swellMiddleValue.text = mocks.report.swell.middle.value
        swellLateTime.text = mocks.report.swell.late.dayPart
        swellLateValue.text = mocks.report.swell.late.value

        tideEarlyTime.text = mocks.report.tide.early.dayPart
        tideEarlyValue.text = mocks.report.tide.early.value
        tideMiddleTime.text = mocks.report.tide.middle.dayPart
        tideMiddleValue.text = mocks.report.tide.middle.value
        tideLateTime.text = mocks.report.tide.late.dayPart
        tideLateValue.text = mocks.report.tide.late.value
    }

    // TODO: implement.
    private fun getOrientation(gradient: SimpleGradient): GradientDrawable.Orientation {
        return GradientDrawable.Orientation.TL_BR
    }

    private val animationListener = object : Animator.AnimatorListener {
        override fun onAnimationEnd(animation: Animator?) {}

        override fun onAnimationRepeat(animation: Animator?) {
            hideSplash()
        }

        override fun onAnimationCancel(animation: Animator?) {}
        override fun onAnimationStart(animation: Animator?) {}
    }

    private fun showSplash() {
        loadingBackground.visibility = View.VISIBLE
        lottie.visibility = View.VISIBLE
        main.visibility = View.GONE
        lottie.playAnimation()
    }

    private fun hideSplash() {
        lottie.cancelAnimation()
        loadingBackground.visibility = View.GONE
        lottie.visibility = View.GONE
        main.visibility = View.VISIBLE
    }

    // TODO: possible candidate for bindings.
    fun ViewGroup.MarginLayoutParams.setMargin(margins: EdgeInsets) {
        setMargins(margins.left.toPx(), margins.top.toPx(), margins.right.toPx(), margins.bottom.toPx())
    }

    // TODO: add to --target android core.
    fun Number.toPx(): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            Resources.getSystem().displayMetrics
        ).toInt()
    }
}

