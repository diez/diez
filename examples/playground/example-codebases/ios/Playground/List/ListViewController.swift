import UIKit
import DiezPlayground

private let CellIdentifier = "cell"

class ListViewController: UITableViewController {

    let items: [NavigationItem]

    private lazy var diez = Diez<DesignSystem>(view: view)

    init(title: String, items: [NavigationItem]) {
        self.items = items

        super.init(nibName: nil, bundle: nil)

        self.title = title
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }

    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.register(UITableViewCell.self, forCellReuseIdentifier: CellIdentifier)

        diez.attach { [weak self] result in
            switch result {
            case .failure(let error):
                fatalError(error.localizedDescription)
            case .success(let designSystem):
                self?.apply(designSystem)
            }
        }
    }

    func apply(_ designSystem: DesignSystem) {
        guard let navigationController = navigationController else {
            fatalError("No navigation controller found.")
        }

        navigationController.navigationBar.applyTitleAttributesWith(typograph: designSystem.typography.navigationTitle)
    }
}

// MARK: - UITableViewDataSource

extension ListViewController {
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: CellIdentifier, for: indexPath)

        let item = items[indexPath.row]

        cell.textLabel?.text = item.title

        return cell
    }
}

// MARK: - UITableViewDelegate

extension ListViewController {
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let navigationController = navigationController else {
            fatalError("Navigation controller was nil")
        }

        let item = items[indexPath.row]
        let viewController = makeViewController(for: item)
        navigationController.pushViewController(viewController, animated: true)
    }

    private func makeViewController(for item: NavigationItem) -> UIViewController {
        switch item.content {
        case .viewController(let makeViewController):
            let viewController = makeViewController()
            viewController.title = item.title
            return viewController
        case .list(let items):
            return ListViewController(title: item.title, items: items)
        }
    }
}
