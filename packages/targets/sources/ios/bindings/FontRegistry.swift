public final class FontRegistry: NSObject, Decodable {
    var files: [File]
    var registeredFiles: Set<File> = []

    init(withFiles files: [File]) {
        self.files = files
        super.init()
        self.registerFonts(withFiles: files)
    }

    private enum CodingKeys: String, CodingKey {
        case files
    }

    private func registerFonts(withFiles files: [File]) {
        files.forEach {
            if registeredFiles.contains($0) {
                return
            }

            registeredFiles.insert($0)

            guard let url = $0.url() else {
                return
            }

            do {
                let data = try Data(contentsOf: url)

                guard let cfData = (data.withUnsafeBytes {(bytes: UnsafePointer<UInt8>) in
                    return CFDataCreate(kCFAllocatorDefault, bytes, data.count)
                }) else {
                    return
                }

                guard let dataProvider = CGDataProvider(data: cfData) else {
                    return
                }

                guard let cgFont = CGFont(dataProvider) else {
                    return
                }

                var error: Unmanaged<CFError>?
                guard CTFontManagerRegisterGraphicsFont(cgFont, &error) else {
                    print("unable to register font")
                    return
                }
            } catch {
                print("unable to load font data")
                print(error)
                return
            }
        }
    }
}

extension FontRegistry: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        files = try container.decode([File].self, forKey: .files)
        // TODO: diff files, only register the new ones
        self.registerFonts(withFiles: files)
    }
}
