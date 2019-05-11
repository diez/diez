//
//  ScrollableStackViewView.m
//  PoodleSurfObjC
//
//  Created by Westin Newell on 5/10/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

#import "ScrollableStackViewView.h"

NS_ASSUME_NONNULL_BEGIN

@interface ScrollableStackViewView ()

@property (readonly, nonatomic) UIStackView *stackView;

@end

@implementation ScrollableStackViewView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];

    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:frame];
    _stackView = [[UIStackView alloc] initWithFrame:CGRectZero];

    [self setupLayoutWithScrollView:scrollView stackView:_stackView];
    [self configureScrollView:scrollView stackView:_stackView];

    return self;
}

- (void)setupLayoutWithScrollView:(UIScrollView *)scrollView stackView:(UIStackView *)stackView {
    NSParameterAssert([scrollView isKindOfClass:UIScrollView.class]);
    NSParameterAssert([stackView isKindOfClass:UIStackView.class]);

    NSMutableArray<NSLayoutConstraint *> *constraints = [NSMutableArray array];

    scrollView.translatesAutoresizingMaskIntoConstraints = false;
    [super addSubview:scrollView];
    [constraints addObjectsFromArray:@[
        [scrollView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
        [scrollView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
        [scrollView.topAnchor constraintEqualToAnchor:self.topAnchor],
        [scrollView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
    ]];

    stackView.translatesAutoresizingMaskIntoConstraints = false;
    [scrollView addSubview:stackView];
    [constraints addObjectsFromArray:@[
        [stackView.topAnchor constraintEqualToAnchor:scrollView.topAnchor],
        [stackView.leftAnchor constraintEqualToAnchor:scrollView.leftAnchor],
        [stackView.widthAnchor constraintEqualToAnchor:scrollView.widthAnchor],
        [stackView.bottomAnchor constraintEqualToAnchor:scrollView.bottomAnchor],
    ]];

    [NSLayoutConstraint activateConstraints:constraints.copy];
}

- (void)configureScrollView:(UIScrollView *)scrollView stackView:(UIStackView *)stackView {
    NSParameterAssert([scrollView isKindOfClass:UIScrollView.class]);
    NSParameterAssert([stackView isKindOfClass:UIStackView.class]);

    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.layoutMarginsRelativeArrangement = true;
}

- (CGFloat)spacing {
    return self.stackView.spacing;
}

- (void)setSpacing:(CGFloat)spacing {
    self.stackView.spacing = spacing;
}

- (UIEdgeInsets)padding {
    return self.stackView.layoutMargins;
}

- (void)setPadding:(UIEdgeInsets)padding {
    self.stackView.layoutMargins = padding;
}

- (void)appendView:(UIView *)view {
    NSParameterAssert([view isKindOfClass:UIView.class]);

    [self.stackView addArrangedSubview:view];
}

@synthesize stackView = _stackView;

+ (BOOL)requiresConstraintBasedLayout {
    return YES;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"initWithCoder: not implemented." userInfo:nil];
}

@end

NS_ASSUME_NONNULL_END
