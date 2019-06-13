import Cocoa

if CommandLine.arguments.count < 2 {
    print("Usage: MacFonts 'family name'")
    exit(1)
}

struct Font: Codable {
    let name: String
    let family: String
    let style: String
    let path: String
}


let registry: [Font] = {
    let descriptor = NSFontDescriptor(fontAttributes: [.family : CommandLine.arguments[1]])
    guard let fonts = CTFontDescriptorCreateMatchingFontDescriptors(descriptor, nil) as? [CTFontDescriptor] else {
        return []
    }

    return fonts.compactMap { font -> Font? in
        guard
            let name = CTFontDescriptorCopyAttribute(font, kCTFontNameAttribute) as? String,
            let family = CTFontDescriptorCopyAttribute(font, kCTFontFamilyNameAttribute) as? String,
            let style = CTFontDescriptorCopyAttribute(font, kCTFontStyleNameAttribute) as? String,
            let url = CTFontDescriptorCopyAttribute(font, kCTFontURLAttribute) as? URL else {
                print("Failed to register: \(font)")
                return nil
        }

        return Font(
            name: name,
            family: family,
            style: style,
            path: url.relativePath)
    }
}()

let output = OutputStream.toMemory()
output.open()
defer {
    output.close()
}

do {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted
    let data = try encoder.encode(registry)
    let bytes = [UInt8](data)
    output.write(bytes, maxLength: bytes.count)
} catch {
    print("Failed to encode registry: \(error)")
    exit(1)
}

let data = output.property(forKey: .dataWrittenToMemoryStreamKey) as! Data
print(String(data: data, encoding: .utf8)!)
