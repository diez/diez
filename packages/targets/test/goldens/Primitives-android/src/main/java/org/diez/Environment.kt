package org.diez

import android.content.res.Resources

internal data class EnvironmentSingleton(
    var isDevelopment: Boolean = true,
    var serverUrl: String = "http://localhost:8081"
) {
    fun initialize(resources: Resources) {
        isDevelopment = resources.getBoolean(R.bool.is_development)
        serverUrl = resources.getString(R.string.server_url)
    }
}

internal val Environment = EnvironmentSingleton()
