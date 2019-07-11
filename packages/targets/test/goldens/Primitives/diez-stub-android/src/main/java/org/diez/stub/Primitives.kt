package org.diez.stub

data class Primitives(
    val number: Float = 10F,
    val integer: Int = 10,
    val float: Float = 10F,
    val string: String = "ten",
    val boolean: Boolean = true,
    val integers: Array<Array<Float>> = arrayOf<Array<Float>>(arrayOf<Float>(1F, 2F), arrayOf<Float>(3F, 4F), arrayOf<Float>(5F)),
    val strings: Array<Array<Array<String>>> = arrayOf<Array<Array<String>>>(arrayOf<Array<String>>(arrayOf<String>("6"), arrayOf<String>("7")), arrayOf<Array<String>>(arrayOf<String>("8"), arrayOf<String>("9")), arrayOf<Array<String>>(arrayOf<String>("10"))),
    val child: ChildComponent = ChildComponent(10F),
    val childs: Array<Array<ChildComponent>> = arrayOf<Array<ChildComponent>>(arrayOf<ChildComponent>(ChildComponent(10F))),
    val emptyChild: EmptyComponent = EmptyComponent()
) : StateBag {
    companion object {}
    override val name = "Primitives"
}
