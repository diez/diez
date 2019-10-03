import UIKit
import SnapKit

class BaselineAlignView<TextView: TextSettableView>: UIView {
    typealias TextViewFactory = () -> TextView

    let constraintView1: TextView
    let constraintView2: TextView
    let constraintView3: TextView

    let firstBaselineStackViewSubview1: TextView
    let firstBaselineStackViewSubview2: TextView

    let lastBaselineStackViewSubview1: TextView
    let lastBaselineStackViewSubview2: TextView

    lazy var singleLineViews: [TextView] = [
        constraintView1,
        constraintView3,
        firstBaselineStackViewSubview2,
        lastBaselineStackViewSubview2
    ]

    lazy var multiLineViews: [TextView] = [
        constraintView2,
        firstBaselineStackViewSubview1,
        lastBaselineStackViewSubview1
    ]

    init(viewFactory: TextViewFactory) {
        constraintView1 = viewFactory()
        constraintView2 = viewFactory()
        constraintView3 = viewFactory()

        firstBaselineStackViewSubview1 = viewFactory()
        firstBaselineStackViewSubview2 = viewFactory()

        lastBaselineStackViewSubview1 = viewFactory()
        lastBaselineStackViewSubview2 = viewFactory()

        super.init(frame: .zero)

        addSubview(constraintView2)
        constraintView2.snp.makeConstraints { make in
            make.centerX.equalTo(self)
            make.top.equalTo(self.safeAreaLayoutGuide.snp.topMargin)
        }

        addSubview(constraintView1)
        constraintView1.snp.makeConstraints { make in
            make.firstBaseline.equalTo(constraintView2)
            make.trailing.equalTo(constraintView2.snp.leading)
        }

        addSubview(constraintView3)
        constraintView3.snp.makeConstraints { make in
            make.lastBaseline.equalTo(constraintView2)
            make.leading.equalTo(constraintView2.snp.trailing)
        }

        let firstBaselineStackView = UIStackView(arrangedSubviews: [
            firstBaselineStackViewSubview1,
            firstBaselineStackViewSubview2,
        ])
        firstBaselineStackView.axis = .horizontal
        firstBaselineStackView.alignment = .firstBaseline
        addSubview(firstBaselineStackView)
        firstBaselineStackView.snp.makeConstraints { make in
            make.center.equalTo(self)
        }

        let lastBaselineStackView = UIStackView(arrangedSubviews: [
            lastBaselineStackViewSubview1,
            lastBaselineStackViewSubview2,
        ])
        lastBaselineStackView.axis = .horizontal
        lastBaselineStackView.alignment = .lastBaseline
        addSubview(lastBaselineStackView)
        lastBaselineStackView.snp.makeConstraints { make in
            make.bottom.equalTo(self.safeAreaLayoutGuide.snp.bottomMargin)
            make.centerX.equalTo(self)
        }

        let blue = UIColor.blue.withAlphaComponent(0.25)
        let yellow = UIColor.yellow.withAlphaComponent(0.75)
        let purple = UIColor.purple.withAlphaComponent(0.075)
        let lightPurple = UIColor.purple.withAlphaComponent(0.05)

        singleLineViews.forEach { view in
            createBaselinView(under: view.snp.firstBaseline, centeredWith: view, colored: blue)
            view.backgroundColor = purple
            view.underlyingView.backgroundColor = lightPurple
        }

        multiLineViews.forEach { view in
            createBaselinView(under: view.snp.firstBaseline, centeredWith: view, colored: yellow)
            createBaselinView(under: view.snp.lastBaseline, centeredWith: view, colored: yellow)
            view.backgroundColor = purple
            view.underlyingView.backgroundColor = lightPurple
        }
    }

    private func createBaselinView(
        under item: ConstraintItem,
        centeredWith view: UIView,
        colored color: UIColor
    ) {
        let lineView = UIView()
        lineView.backgroundColor = color
        insertSubview(lineView, at: 0)
        lineView.snp.makeConstraints { make in
            make.height.equalTo(1)
            make.width.equalTo(99999)
            make.top.equalTo(item)
            make.centerX.equalTo(view)
        }
    }

    @available(*, unavailable)
    override init(frame: CGRect) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
