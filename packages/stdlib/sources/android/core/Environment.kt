package {{{packageName}}}

import android.content.Context
import android.content.res.Resources

class Environment {
    companion object {
        var isHot = false
        var serverUrl = ""
        lateinit var resources: Resources
        lateinit var packageName: String

        fun setContext(context: Context) {
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
}
