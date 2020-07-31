package org.diez.targetTestStub

data class NestedPrefabComponent(
    /**
     * 1
     */
    val diez: Float,
    /**
     * - diez: `2`
     */
    val child: ChildComponent,
    /**
     * hsla(0, 0, 0, 1)
     */
    val color: Color
) {
    companion object {}
}
