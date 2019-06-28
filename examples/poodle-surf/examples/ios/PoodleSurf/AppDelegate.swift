//
//  AppDelegate.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    private let loadingViewController = LoadingViewController()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let viewController = ReportViewController()
        let navigationController = UINavigationController(rootViewController: viewController)

        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = navigationController
        window.makeKeyAndVisible()
        self.window = window

        showLoading()

        return true
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        showLoading()
    }

    private func showLoading() {
        window?.rootViewController?.present(loadingViewController, animated: false)
        DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) { [weak self] in
            self?.loadingViewController.dismiss(animated: true)
        }
    }
}
