//
//  GradientView.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 5/10/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

#import "GradientView.h"

NS_ASSUME_NONNULL_BEGIN

@interface GradientView ()

@property (nonatomic, readonly) CAGradientLayer *gradientLayer;

@end

@implementation GradientView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];

    _gradientLayer = [CAGradientLayer layer];
    _gradientLayer.frame = self.layer.bounds;

    [self.layer addSublayer:_gradientLayer];

    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];

    self.gradientLayer.frame = self.layer.bounds;
}

- (void)applyGradient:(DEZSimpleGradient *)gradient {
    self.gradientLayer.colors = @[
        (id)gradient.startColor.uiColor.CGColor,
        (id)gradient.endColor.uiColor.CGColor,
    ];
    self.gradientLayer.locations = @[@0, @1];
    self.gradientLayer.startPoint = (CGPoint){
        .x =  gradient.startPointX,
        .y = gradient.startPointX,
    };
    self.gradientLayer.endPoint = (CGPoint){
        .x = gradient.endPointX,
        .y = gradient.endPointX,
    };
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"initWithCoder: not implemented." userInfo:nil];
}

@end

NS_ASSUME_NONNULL_END
