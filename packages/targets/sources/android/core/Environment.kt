import android.content.Context
import android.content.res.Resources

internal data class EnvironmentSingleton(
    var isHot: Boolean = false,
    var serverUrl: String = ""
) {
    lateinit var resources: Resources
    lateinit var packageName: String
    fun initialize(context: Context) {
        resources = context.resources
        packageName = context.packageName
        val isHotResourceId = resources.getIdentifier("diez_is_hot", "bool", packageName)
        val serverUrlResourceId = resources.getIdentifier("diez_server_url", "string", packageName)
        if (isHotResourceId != 0) {
            isHot = resources.getBoolean(isHotResourceId)
        }
        if (serverUrlResourceId != 0) {
            serverUrl = resources.getString(serverUrlResourceId)
        }
    }
}

internal val Environment = EnvironmentSingleton()
