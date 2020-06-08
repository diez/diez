package org.diez.targetTestStub

/**
 * Test object comment
 *
 */
data class Primitives(
    /**
     * Test property comment
     *
     * 10
     */
    val number: Float = 10f,
    /**
     * 10
     */
    val integer: Int = 10,
    /**
     * 10
     */
    val float: Float = 10f,
    /**
     * ten
     */
    val string: String = "ten",
    /**
     * true
     */
    val boolean: Boolean = true,
    /**
     * [[1,2],[3,4],[5]]
     */
    val integers: Array<Array<Float>> = arrayOf<Array<Float>>(arrayOf<Float>(1f, 2f), arrayOf<Float>(3f, 4f), arrayOf<Float>(5f)),
    /**
     * [[[6],[7]],[[8],[9]],[[10]]]
     */
    val strings: Array<Array<Array<String>>> = arrayOf<Array<Array<String>>>(arrayOf<Array<String>>(arrayOf<String>("6"), arrayOf<String>("7")), arrayOf<Array<String>>(arrayOf<String>("8"), arrayOf<String>("9")), arrayOf<Array<String>>(arrayOf<String>("10"))),
    /**
     * []
     */
    val emptyList: Array<String> = arrayOf<String>(),
    /**
     * - diez: `10`
     */
    val child: ChildComponent = ChildComponent(10f),
    /**
     * [[]]
     */
    val childs: Array<Array<ChildComponent>> = arrayOf<Array<ChildComponent>>(arrayOf<ChildComponent>(ChildComponent(10f))),
    val emptyChild: EmptyComponent = EmptyComponent(),
    /**
     * References too!
     *
     * `References.myRef` ( 10 )
     */
    val referred: Float = 10f,
    /**
     * quoted
     */
    val quoted: String = "quoted",
    /**
     * reserved word
     */
    val _class: String = "reserved word",
    /**
     * starts with number
     */
    val _10diez: String = "starts with number",
    /**
     * contains invalid characters
     */
    val diEz: String = "contains invalid characters",
    /**
     * mix of invalid and numbers
     */
    val _10Diez: String = "mix of invalid and numbers"
) : RootComponent {
    companion object {}
    override val name = "Primitives"
}
