//
//  AppDelegate.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 4/19/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

#import "AppDelegate.h"
#import "ViewController.h"

NS_ASSUME_NONNULL_BEGIN

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(nullable NSDictionary *)launchOptions {
    UIWindow *window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
    window.rootViewController = [[ViewController alloc] init];
    [window makeKeyAndVisible];

    self.window = window;

    return YES;
}

@end

NS_ASSUME_NONNULL_END
