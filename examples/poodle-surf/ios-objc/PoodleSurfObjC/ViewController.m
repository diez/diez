//
//  ViewController.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 4/19/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

@import Diez;

#import "ViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ViewController ()

@property (nonatomic, nullable) DEZDiezDesignSystem *diez;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.diez = [[DEZDiezDesignSystem alloc] initWithView:self.view];

    [self.diez attach:^(DEZDesignSystem *component) {
        NSLog(@"Received component update:\n%@", component);
    }];
}

@end

NS_ASSUME_NONNULL_END
