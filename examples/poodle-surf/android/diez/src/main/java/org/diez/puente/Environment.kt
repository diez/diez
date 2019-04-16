package org.diez.puente

import org.diez.R
import android.content.res.Resources

data class EnvironmentSingleton(
    var isDevelopment: Boolean = true,
    var serverUrl: String = "http://localhost:8081"
) {
    fun initialize(resources: Resources) {
        isDevelopment = resources.getBoolean(R.bool.is_development)
        serverUrl = resources.getString(R.string.server_url)
    }
}

val Environment = EnvironmentSingleton()
