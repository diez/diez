import { Color, Font, Typograph } from "@diez/prefabs";

class SemanticUiKitColors {
    black = Color.rgb(27, 28, 29);
    grey = Color.rgb(118, 118, 118);
    brown = Color.rgb(165, 103, 63);
    pink = Color.rgb(224, 57, 151);
    violet = Color.rgb(100, 53, 201);
    blue = Color.rgb(169, 0, 244);
    teal = Color.rgb(0, 181, 173);
    green = Color.rgb(33, 186, 69);
    olive = Color.rgb(181, 204, 24);
    yellow = Color.rgb(251, 189, 8);
    orange = Color.rgb(242, 113, 28);
    red = Color.rgb(219, 40, 40);
    purple = Color.rgb(163, 51, 200);
}

class SemanticUiKitTypography {
    h1 = new Typograph({color: rgb(38, 142, 230), font: SemanticUiKitFonts.MinionPro.Caption, fontSize: 32});
    h2 = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Bold, fontSize: 24});
    h3 = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Bold, fontSize: 18});
    h4 = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Bold, fontSize: 15});
    h5 = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Bold, fontSize: 14});
    paragraph = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 16});
    subheader = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 16});
    description = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 13});
    tableHeader = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Heavy, fontSize: 14});
    tableBody = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 14});
    descriptionMuted = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 13});
    cardSmallUserTitle = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Bold, fontSize: 13});
    timeAndDatestampMuted = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 12});
    commentBody = new Typograph({color: rgb(0, 0, 0), font: SemanticUiKitFonts.Lato.Regular, fontSize: 14});
}

export const SemanticUiKitFonts = {
    MinionPro: {
        Caption: Font.fromFile("assets/SemanticUiKit.xd.contents/fonts/MinionPro-Capt.otf")
    },
    Lato: {
        Bold: Font.fromFile("assets/SemanticUiKit.xd.contents/fonts/Lato-Bold.otf"),
        Regular: Font.fromFile("assets/SemanticUiKit.xd.contents/fonts/Lato-Regular.otf"),
        Heavy: Font.fromFile("assets/SemanticUiKit.xd.contents/fonts/Lato-Heavy.otf")
    }
};

export class SemanticUiKitTokens {
    colors = new SemanticUiKitColors();
    typography = new SemanticUiKitTypography();
}

export const semanticUiKitTokens = new SemanticUiKitTokens();
