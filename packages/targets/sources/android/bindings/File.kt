package org.diez

import android.net.Uri
import java.net.URL

data class File(
    val src: String
)

private val fileReplacer = """[^a-z0-9_]""".toRegex()

private val File.resourcePath: String
    get() {
        return "raw/${fileReplacer.replace(src.toLowerCase(), "_")}"
    }

internal val File.resourceId: Int
    get() {
        return Environment.resources.getIdentifier(
            fileReplacer.replace(src.toLowerCase(), "_"),
            "raw",
            Environment.packageName
        )
    }

internal val File.canonicalURL: String
    get() {
        if (Environment.isDevelopment) {
            return "${Environment.serverUrl}$src"
        }

        return "android.resource://${Environment.packageName}/$resourcePath"
    }

internal val File.websafeURL: String
    get() {
        if (Environment.isDevelopment) {
            return canonicalURL
        }

        return "file:///android_res/$resourcePath"
    }

val File.uri: Uri
    get() {
        return Uri.parse(this.canonicalURL)
    }


val File.url: URL
    get() {
        return URL(this.canonicalURL)
    }
