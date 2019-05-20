//
//  ViewController.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 4/19/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

@import DiezPoodleSurf;
@import Lottie;

#import "UIEdgeInsets+EdgeInsets.h"

#import "ScrollableStackViewView.h"
#import "GradientView.h"

#import "ViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ViewController ()

@property (nonatomic, nullable) DEZDiezDesignSystem *diez;

@property (readonly) ScrollableStackViewView *stackView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    UILabel *label = [[UILabel alloc] init];
    label.textAlignment = NSTextAlignmentCenter;
    [self.stackView appendView:label];

    UITextView *textView = [[UITextView alloc] init];
    textView.textAlignment = NSTextAlignmentCenter;
    textView.scrollEnabled = NO;
    textView.backgroundColor = UIColor.clearColor;
    [self.stackView appendView:textView];

    UITextField *textField = [[UITextField alloc] init];
    textField.textAlignment = NSTextAlignmentCenter;
    [self.stackView appendView:textField];

    UIImageView *imageView = [[UIImageView alloc] init];
    imageView.contentMode = UIViewContentModeScaleAspectFit;
    [self.stackView appendView:imageView];

    LOTAnimationView *animationView = [[LOTAnimationView alloc] init];
    [self.stackView appendView:animationView];
    [animationView.heightAnchor constraintEqualToAnchor:animationView.widthAnchor].active = YES;

    GradientView *gradientView = [[GradientView alloc] init];
    [self.stackView appendView:gradientView];
    [gradientView.heightAnchor constraintEqualToAnchor:gradientView.widthAnchor multiplier:0.25].active = YES;

    self.diez = [[DEZDiezDesignSystem alloc] initWithView:self.view];
    [self.diez attach:^(DEZDesignSystem  * _Nullable component, NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"%@", error.localizedDescription);
            return;
        }

        self.stackView.backgroundColor = component.designs.loading.backgroundColor.color;
        self.stackView.spacing = component.designs.report.contentSpacing;
        self.stackView.layoutMargins = DEZUIEdgeInsetsMake(component.designs.report.contentLayoutMargins);

        [label dez_applyTextStyle:component.designs.navigationTitle.textStyle];
        label.text = component.designs.navigationTitle.title;

        [textView dez_applyTextStyle:component.designs.navigationTitle.textStyle];
        textView.text = component.designs.navigationTitle.title;

        [textField dez_applyTextStyle:component.designs.navigationTitle.textStyle];
        textField.text = component.designs.navigationTitle.title;

        imageView.image = component.designs.navigationTitle.icon.image;

        [gradientView applyGradient:component.designs.report.waterTemperature.shared.gradient];

        [animationView dez_loadLottie:component.designs.loading.animation withSession:NSURLSession.sharedSession completion:nil];
    }];
}

- (void)loadView {
    self.view = [[ScrollableStackViewView alloc] init];
}

- (ScrollableStackViewView *)stackView {
    return (ScrollableStackViewView *)self.view;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"initWithCoder: not implemented." userInfo:nil];
}

@end

NS_ASSUME_NONNULL_END
