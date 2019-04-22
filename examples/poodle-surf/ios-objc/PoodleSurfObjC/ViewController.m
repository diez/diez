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

@property (nonatomic, nullable) DiezDesignSystem *diez;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.diez = [[DiezDesignSystem alloc] initWithView:self.view];

    [self.diez attach:^(DesignSystem *component) {
        NSLog(@"Received component update:\n%@", component);
    }];
}

@end

NS_ASSUME_NONNULL_END
