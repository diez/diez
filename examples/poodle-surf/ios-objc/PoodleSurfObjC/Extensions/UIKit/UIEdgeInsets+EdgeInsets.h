//
//  UIEdgeInsets+EdgeInsets.h
//  PoodleSurfObjC
//
//  Created by Westin Newell on 5/10/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

@import UIKit;
@import Diez;

NS_ASSUME_NONNULL_BEGIN

UIKIT_STATIC_INLINE UIEdgeInsets DEZUIEdgeInsetsMake(DEZEdgeInsets *edgeInsets) {
    UIEdgeInsets insets = {edgeInsets.top, edgeInsets.left, edgeInsets.bottom, edgeInsets.right};
    return insets;
}

NS_ASSUME_NONNULL_END
