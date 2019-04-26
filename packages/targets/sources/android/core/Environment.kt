package org.diez

import android.content.Context
import android.content.res.Resources

internal data class EnvironmentSingleton(
    var isDevelopment: Boolean = true,
    var serverUrl: String = "http://localhost:8081"
) {
    lateinit var resources: Resources
    lateinit var packageName: String
    fun initialize(context: Context) {
        resources = context.resources
        packageName = context.packageName
        isDevelopment = resources.getBoolean(R.bool.is_development)
        serverUrl = resources.getString(R.string.server_url)
    }
}

internal val Environment = EnvironmentSingleton()
