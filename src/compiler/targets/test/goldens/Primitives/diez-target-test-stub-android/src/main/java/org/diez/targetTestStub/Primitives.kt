package org.diez.targetTestStub

/**
 * Test object comment
 *
 */
data class Primitives(
    /**
      Test property comment
    */
    val number: Float = 10f,
    val integer: Int = 10,
    val float: Float = 10f,
    val string: String = "ten",
    val boolean: Boolean = true,
    val integers: Array<Array<Float>> = arrayOf<Array<Float>>(arrayOf<Float>(1f, 2f), arrayOf<Float>(3f, 4f), arrayOf<Float>(5f)),
    val strings: Array<Array<Array<String>>> = arrayOf<Array<Array<String>>>(arrayOf<Array<String>>(arrayOf<String>("6"), arrayOf<String>("7")), arrayOf<Array<String>>(arrayOf<String>("8"), arrayOf<String>("9")), arrayOf<Array<String>>(arrayOf<String>("10"))),
    val emptyList: Array<String> = arrayOf<String>(),
    val child: ChildComponent = ChildComponent(10f),
    val childs: Array<Array<ChildComponent>> = arrayOf<Array<ChildComponent>>(arrayOf<ChildComponent>(ChildComponent(10f))),
    val emptyChild: EmptyComponent = EmptyComponent(),
    /**
      References too!
    */
    val referred: Float = 10f
) : RootComponent {
    companion object {}
    override val name = "Primitives"
}
