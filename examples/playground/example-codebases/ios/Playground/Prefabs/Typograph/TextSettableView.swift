import Foundation
import DiezPlayground

protocol TextSettableView: UIView {
    var text: String? { get set }
    var attributedText: NSAttributedString? { get set }
    var underlyingView: UIView { get }
}

extension Label: TextSettableView {
    var underlyingView: UIView { return uiLabel }
}
extension TextView: TextSettableView {
    var underlyingView: UIView { return uiTextView }
}
extension TextField: TextSettableView {
    var underlyingView: UIView { return uiTextField }
}
extension Button: TextSettableView {
    var text: String? {
        get { return title(for: .normal) }
        set { setTitle(newValue, for: .normal) }
    }
    var attributedText: NSAttributedString? {
        get { return attributedTitle(for: .normal) }
        set { setAttributedTitle(newValue, for: .normal) }
    }
    var underlyingView: UIView { return uiButton }
}
