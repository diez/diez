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

@property (nonatomic, nullable) DEZDiezDesignLanguage *diez;

@property (readonly) ScrollableStackViewView *stackView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    DEZLabel *label = [[DEZLabel alloc] init];
    [self.stackView appendView:label];

    DEZTextView *textView = [[DEZTextView alloc] init];
    textView.uiTextView.scrollEnabled = NO;
    [self.stackView appendView:textView];

    DEZTextField *textField = [[DEZTextField alloc] init];
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
    [self.stackView appendView:pointLabel];

    UILabel *sizeLabel = [[UILabel alloc] init];
    [self.stackView appendView:sizeLabel];

    self.diez = [[DEZDiezDesignLanguage alloc] initWithView:self.view];
    [self.diez attach:^(DEZDesignLanguage  * _Nullable component, NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"%@", error.localizedDescription);
            return;
        }

        self.stackView.backgroundColor = [UIColor dez_colorWithDEZColor:component.designs.loading.backgroundColor];
        self.stackView.spacing = component.designs.report.contentSpacing;
        self.stackView.layoutMargins = DEZUIEdgeInsetsMake(component.designs.report.contentLayoutMargins);

        [label applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        label.text = component.designs.navigationTitle.title;

        [textView applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        textView.text = component.designs.navigationTitle.title;

        [textField applyTypograph:component.designs.navigationTitle.typograph withTraitCollection:nil];
        textField.text = component.designs.navigationTitle.title;

        imageView.image = [UIImage dez_imageWithDEZImage:component.designs.navigationTitle.icon];

        UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Ten" style:UIBarButtonItemStylePlain target:nil action:nil];
        self.navigationItem.rightBarButtonItem = item;

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
