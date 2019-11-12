import UIKit
import DiezPlayground

class BaselineAlignViewController<TextView: TextSettableView>: UIViewController {
    typealias TextViewApplicator = (TextView, Typograph, Typograph) -> ()

    private let textViewFactory: BaselineAlignView<TextView>.TextViewFactory
    private let applicator: TextViewApplicator

    private lazy var diez = Diez<DesignLanguage>(view: view)
    private lazy var baselineAlignView = BaselineAlignView<TextView>(viewFactory: textViewFactory)
    private var timer: Timer?
    private let textParts = [
        "Lorem Ipsum",
        "dolor sit amet,",
        "consectetur adipiscing",
        "elit, sed do",
        "eiusmod tempor",
    ]

    init(
        textViewFactory: @escaping BaselineAlignView<TextView>.TextViewFactory,
        applicator: @escaping TextViewApplicator
    ) {
        self.textViewFactory = textViewFactory
        self.applicator = applicator

        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .white

        updateText()

        diez.attach { [weak self] result in
            switch result {
            case .failure(let error):
                fatalError(error.localizedDescription)
            case .success(let designLanguage):
                self?.apply(designLanguage)
            }
        }

        var shouldUpdateAttributedText = true

        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            defer {
                shouldUpdateAttributedText = !shouldUpdateAttributedText
            }

            guard shouldUpdateAttributedText else {
                self?.updateText()
                return
            }

            self?.updateAttributedText()
        }
    }

    override func loadView() {
        view = baselineAlignView
    }

    private func apply(_ designLanguage: DesignLanguage) {
        baselineAlignView.singleLineViews.forEach {
            self.applicator($0, designLanguage.typography.basic, designLanguage.typography.buttonPressed)
        }
        baselineAlignView.multiLineViews.forEach {
            self.applicator($0, designLanguage.typography.tallLineHeight, designLanguage.typography.buttonPressed)
        }
    }

    private func getParts(at index: Int, count: Int) -> [String] {
        guard count > 0 else {
            return []
        }

        var parts: [String] = []
        var i = index
        for _ in 0..<count {
            i = i % textParts.count
            parts.append(textParts[i])
            i += 1
        }

        return parts
    }

    /// - Returns: A tuple containing a random single line string and multi-line string.
    private func getStringParts() -> (single: String, multiline: String) {
        let index = Int.random(in: 0..<textParts.count)
        let parts = getParts(at: index, count: 4)
        return (parts[0], parts[1...3].joined(separator: "\n"))
    }

    private func updateText() {
        let (single, multiline) = getStringParts()

        baselineAlignView.singleLineViews.forEach { $0.text = single }
        baselineAlignView.multiLineViews.forEach { $0.text = multiline }
    }

    private func updateAttributedText() {
        let (singleText, multilineText) = getStringParts()
        let attributes: [NSAttributedString.Key: Any] = [
            .strokeColor: UIColor.red,
            .strokeWidth: 5
        ]
        let single = NSAttributedString(string: singleText, attributes: attributes)
        let multiline = NSAttributedString(string: multilineText, attributes: attributes)

        baselineAlignView.singleLineViews.forEach { $0.attributedText = single }
        baselineAlignView.multiLineViews.forEach { $0.attributedText = multiline }
    }
}
