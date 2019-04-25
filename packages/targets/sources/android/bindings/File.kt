package org.diez

import android.net.Uri
import java.net.URL

data class File(
    val src: String
)

val File.canonicalURL: String
    get() {
        if (Environment.isDevelopment) {
            return "${Environment.serverUrl}${src}"
        }

        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will probably look something like: file:///android_asset/diez/path/to/asset.extension
        return "TODO"
    }

val File.uri: Uri
    get() {
        return Uri.parse(this.canonicalURL)
    }


val File.url: URL
    get() {
        return URL(this.canonicalURL)
    }
