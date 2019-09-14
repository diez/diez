package {{{packageName}}}

import android.net.Uri
import java.net.URL

{{> androidDataClassStart }}

    val uri: Uri
        get() {
            return Uri.parse(this.canonicalURL)
        }

    val url: URL
        get() {
            return URL(this.canonicalURL)
        }

    internal val resourceName: String
        get() {
            return extensionReplacer.replace(fileReplacer.replace(src.toLowerCase(), "_"), "$1")
        }

    internal val resourceId: Int
        get() {
            return Environment.resources.getIdentifier(
                resourceName,
                type,
                Environment.packageName
            )
        }

    internal val canonicalURL: String
        get() {
            if (Environment.isHot) {
                return "${Environment.serverUrl}/$src"
            }

            return "android.resource://${Environment.packageName}/$resourcePath"
        }

    internal val websafeURL: String
        get() {
            if (Environment.isHot) {
                return canonicalURL
            }

            return "file:///android_res/$resourcePath"
        }

    private val resourcePath: String
        get() {
            return "$type/$resourceName"
        }
}

private val extensionReplacer = """(.+)(_.+)""".toRegex()
private val fileReplacer = """[^a-z0-9_]""".toRegex()
