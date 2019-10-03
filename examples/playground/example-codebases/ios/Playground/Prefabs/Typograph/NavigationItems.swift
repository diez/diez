import DiezPlayground
import SnapKit

let buttonPressedTypograph = DesignSystem().typography.buttonPressed

let typographNavigationItem = NavigationItem(title: "Typograph", content: .list([
    NavigationItem(title: "Label", content: .list([
        NavigationItem(title: "Baseline Alignment", content: .viewController({
            BaselineAlignViewController<Label>(
                textViewFactory: {
                    let label = Label()
                    label.numberOfLines = 0
                    return label
                },
                applicator: { label, typograph, _ in
                    label.apply(typograph)
                }
            )
        })),
    ])),
    NavigationItem(title: "TextView", content: .list([
        NavigationItem(title: "Baseline Alignment", content: .viewController({
            BaselineAlignViewController<TextView>(
                textViewFactory: {
                    let textView = TextView()
                    textView.isScrollEnabled = false
                    return textView
                },
                applicator: { textView, typograph, _ in
                    textView.apply(typograph)
                }
            )
        })),
    ])),
    NavigationItem(title: "TextField", content: .list([
        NavigationItem(title: "Baseline Alignment", content: .viewController({
            BaselineAlignViewController<TextField>(
                textViewFactory: { TextField() },
                applicator: { textField, typograph, _ in
                    textField.apply(typograph)
                }
            )
        })),
    ])),
    NavigationItem(title: "Button", content: .list([
        NavigationItem(title: "Baseline Alignment", content: .viewController({
            BaselineAlignViewController<Button>(
                textViewFactory: {
                    let button = Button()
                    button.numberOfLines = 0
                    return button
                },
                applicator: { button, typograph, typographAlternate in
                    button.apply(typograph, for: .normal)
                    button.apply(typographAlternate, for: .highlighted)
                }
            )
        })),
    ])),
    NavigationItem(title: "UISegmentedControl", content: .viewController({
        SegmentedControlViewController()
    })),
    NavigationItem(title: "UIBarButtonItem", content: .viewController({
        BarButtonItemViewController()
    })),
]))
