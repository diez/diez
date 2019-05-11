//
//  ScrollableStackViewView.h
//  PoodleSurfObjC
//
//  Created by Westin Newell on 5/10/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ScrollableStackViewView : UIView

@property (nonatomic) CGFloat spacing;

@property (nonatomic) UIEdgeInsets padding;

- (void)appendView:(UIView *)view;

- (instancetype)initWithCoder:(NSCoder *)aDecoder __attribute__((unavailable("This class does not support NSCoding.")));
- (void)addSubview:(UIView *)view __attribute__((unavailable("Use appendView: instead.")));
- (void)insertSubview:(UIView *)view atIndex:(NSInteger)index __attribute__((unavailable("Use appendView: instead.")));
- (void)insertSubview:(UIView *)view aboveSubview:(UIView *)siblingSubview __attribute__((unavailable("Use appendView: instead.")));
- (void)insertSubview:(UIView *)view belowSubview:(UIView *)siblingSubview __attribute__((unavailable("Use appendView: instead.")));
- (void)removeSubview:(UIView *)view __attribute__((unavailable("removeSubview: is unavailble.")));

@end

NS_ASSUME_NONNULL_END
