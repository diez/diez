package ai.haiku.diez.file

import ai.haiku.diez.puente.Environment
import android.net.Uri
import java.net.URL

data class File(val src: String) {
    fun canonicalURL(): String {
        if (Environment.isDevelopment) {
            return "${Environment.serverUrl}${src}"
        }

        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will probably look something like: file:///android_asset/diez/path/to/asset.extension
        return "TODO"
    }

    fun uri(): Uri {
        return Uri.parse(canonicalURL())
    }

    fun url(): URL {
        return URL(canonicalURL())
    }
}
