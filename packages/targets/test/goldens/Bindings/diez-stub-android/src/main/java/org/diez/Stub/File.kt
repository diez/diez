package org.diez.stub

import android.net.Uri
import java.net.URL

private val extensionReplacer = """(.+)(_.+)""".toRegex()
private val fileReplacer = """[^a-z0-9_]""".toRegex()

internal val File.resourceName: String
    get() {
        return extensionReplacer.replace(fileReplacer.replace(src.toLowerCase(), "_"), "$1")
    }

private val File.resourcePath: String
    get() {
        return "$type/$resourceName"
    }

internal val File.resourceId: Int
    get() {
        return Environment.resources.getIdentifier(
            resourceName,
            type,
            Environment.packageName
        )
    }

internal val File.canonicalURL: String
    get() {
        if (Environment.isHot) {
            return "${Environment.serverUrl}/$src"
        }

        return "android.resource://${Environment.packageName}/$resourcePath"
    }

internal val File.websafeURL: String
    get() {
        if (Environment.isHot) {
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

data class File(
    val src: String,
    val type: String
) {
    companion object {}
}
