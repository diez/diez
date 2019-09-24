export declare class DropShadow {
  /**
   * The CSS box-shadow representation of the `DropShadow`.
   * @example
   * 0px 1px 16px rgba(0, 0, 16, .4)
   */
  boxShadow: string;
  /**
   * The CSS text-shadow representation of the `DropShadow`.
   * @example
   * 0px 1px 16px rgba(0, 0, 16, .4)
   */
  textShadow: string;
  /**
   * The CSS filter representation of the `DropShadow`.
   * @example
   * drop-shadow(0px 1px 16px rgba(0, 0, 16, .4))
   */
  filter: string;
  /**
   * CSS declarations for the `box-shadow` CSS property.
   */
  boxShadowStyle: {boxShadow: string};
  /**
   * CSS declarations for the `text-shadow` CSS property.
   */
  textShadowStyle: {textShadow: string};
  /**
   * CSS declarations for the `filter` CSS property.
   */
  filterStyle: {filter: string};
}
