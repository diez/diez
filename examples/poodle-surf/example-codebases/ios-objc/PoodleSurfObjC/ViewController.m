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

    AnimationView *animationView = [[AnimationView alloc] init];
    [self.stackView appendView:animationView];
    [animationView.heightAnchor constraintEqualToAnchor:animationView.widthAnchor].active = YES;

    GradientView *gradientView = [[GradientView alloc] init];
    [self.stackView appendView:gradientView];
    [gradientView.heightAnchor constraintEqualToAnchor:gradientView.widthAnchor multiplier:0.25].active = YES;

    DEZPanelView *panelView = [[DEZPanelView alloc] init];
    [self.stackView appendView:panelView];
    [panelView.heightAnchor constraintEqualToAnchor:panelView.widthAnchor multiplier:0.25].active = YES;

    UILabel *pointLabel = [[UILabel alloc] init];
    pointLabel.textAlignment = NSTextAlignmentCenter;
    [self.stackView appendView:pointLabel];

    UILabel *sizeLabel = [[UILabel alloc] init];
    sizeLabel.textAlignment = NSTextAlignmentCenter;
    [self.stackView appendView:sizeLabel];

    self.diez = [[DEZDiezDesignSystem alloc] initWithView:self.view];
    [self.diez attach:^(DEZDesignSystem  * _Nullable component, NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"%@", error.localizedDescription);
            return;
        }

        self.stackView.backgroundColor = [UIColor dez_colorWithDEZColor:component.designs.loading.backgroundColor];
        self.stackView.spacing = component.designs.report.contentSpacing;
        self.stackView.layoutMargins = DEZUIEdgeInsetsMake(component.designs.report.contentLayoutMargins);

        [label dez_applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        label.text = component.designs.navigationTitle.title;

        [textView dez_applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        textView.text = component.designs.navigationTitle.title;

        [textField dez_applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        textField.text = component.designs.navigationTitle.title;

        imageView.image = [UIImage dez_imageWithDEZImage:component.designs.navigationTitle.icon];

        [imageView.layer dez_applyDropShadow:component.designs.report.wind.shared.panel.dropShadow];

        [gradientView.gradientLayer dez_applyLinearGradient:component.designs.report.waterTemperature.shared.panel.background.linearGradient];

        [panelView applyPanel:component.designs.report.wind.shared.panel];

        [animationView dez_loadLottie:component.designs.loading.animation completion:nil];

        pointLabel.text = [NSString stringWithFormat:@"Point: %@", NSStringFromCGPoint(component.palette.contentBackground.end.cgPoint)];

        sizeLabel.text = [NSString stringWithFormat:@"Size: %@", NSStringFromCGSize(component.designs.report.wind.dayPart.iconSize.cgSize)];
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
