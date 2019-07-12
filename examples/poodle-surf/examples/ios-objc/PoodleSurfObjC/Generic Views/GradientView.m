//
//  GradientView.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 5/10/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

#import "GradientView.h"

NS_ASSUME_NONNULL_BEGIN

@implementation GradientView

- (CAGradientLayer *)gradientLayer {
    return (CAGradientLayer *)self.layer;
}

+ (Class)layerClass {
    return CAGradientLayer.class;
}

@end

NS_ASSUME_NONNULL_END
