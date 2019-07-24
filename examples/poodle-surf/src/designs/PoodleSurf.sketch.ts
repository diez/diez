import { Color, File, GradientStop, Image, LinearGradient, Point2D } from "@diez/prefabs";

class PoodleSurfColors {
    pink = Color.rgba(255, 63, 112, 1);
    orange = Color.rgba(255, 154, 58, 1);
    blue = Color.rgba(120, 207, 253, 1);
    white = Color.rgba(255, 255, 255, 1);
    whiteA40 = Color.rgba(255, 255, 255, 0.4);
    black = Color.rgba(0, 0, 0, 1);
}

class PoodleSurfGradients {
    gradient = new LinearGradient({stops: [GradientStop.make(0.000000, Color.rgba(255, 63, 112, 1)), GradientStop.make(1.000000, Color.rgba(255, 154, 58, 1))], start: Point2D.make(0.256905, -0.052988), end: Point2D.make(0.912005, 1.039424)});
}

export class PoodleSurfSlicesFiles {
    static Thermometer = new File({src: "assets/PoodleSurf.sketch.contents/slices/Thermometer.png"});
    static Thermometer2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Thermometer@2x.png"});
    static Thermometer3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Thermometer@3x.png"});
    static Thermometer4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Thermometer@4x.png"});
    static Gear = new File({src: "assets/PoodleSurf.sketch.contents/slices/Gear.png"});
    static Gear2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Gear@2x.png"});
    static Gear3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Gear@3x.png"});
    static Gear4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Gear@4x.png"});
    static SantaCruzBanner = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Banner.png"});
    static SantaCruzBanner2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Banner@2x.png"});
    static SantaCruzBanner3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Banner@3x.png"});
    static SantaCruzBanner4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Banner@4x.png"});
    static SantaCruzMap = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Map.png"});
    static SantaCruzMap2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Map@2x.png"});
    static SantaCruzMap3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Map@3x.png"});
    static SantaCruzMap4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Santa Cruz Map@4x.png"});
    static MapPin = new File({src: "assets/PoodleSurf.sketch.contents/slices/Map Pin.png"});
    static MapPin2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Map Pin@2x.png"});
    static MapPin3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Map Pin@3x.png"});
    static MapPin4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Map Pin@4x.png"});
    static DirectionSouthWest = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South West.png"});
    static DirectionSouthWest2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South West@2x.png"});
    static DirectionSouthWest3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South West@3x.png"});
    static DirectionSouthWest4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South West@4x.png"});
    static DirectionSouth = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South.png"});
    static DirectionSouth2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South@2x.png"});
    static DirectionSouth3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South@3x.png"});
    static DirectionSouth4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - South@4x.png"});
    static DirectionNorthEast = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - North East.png"});
    static DirectionNorthEast2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - North East@2x.png"});
    static DirectionNorthEast3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - North East@3x.png"});
    static DirectionNorthEast4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Direction - North East@4x.png"});
    static Icon = new File({src: "assets/PoodleSurf.sketch.contents/slices/Icon.png"});
    static Icon2x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Icon@2x.png"});
    static Icon3x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Icon@3x.png"});
    static Icon4x = new File({src: "assets/PoodleSurf.sketch.contents/slices/Icon@4x.png"});
}

export class PoodleSurfSlices {
    static Thermometer = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Thermometer.png", 29, 30);
    static Gear = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Gear.png", 29, 18);
    static SantaCruzBanner = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Santa Cruz Banner.png", 360, 147);
    static SantaCruzMap = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Santa Cruz Map.png", 100, 100);
    static MapPin = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Map Pin.png", 9, 14);
    static DirectionSouthWest = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Direction - South West.png", 78, 78);
    static DirectionSouth = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Direction - South.png", 78, 78);
    static DirectionNorthEast = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Direction - North East.png", 78, 78);
    static Icon = Image.responsive("assets/PoodleSurf.sketch.contents/slices/Icon.png", 29, 26);
}

export class PoodleSurfTokens {
    colors = new PoodleSurfColors();
    gradients = new PoodleSurfGradients();
}

export const poodleSurfTokens = new PoodleSurfTokens();
