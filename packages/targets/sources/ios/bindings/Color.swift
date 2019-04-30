extension Color {
    /**
     A `UIColor` representation of the color.
     */
    @objc public var color: UIColor {
        let brightness = l + s * min(l, 1 - l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * l / brightness
        return UIColor(hue: h, saturation: saturation, brightness: brightness, alpha: a)
    }
}
