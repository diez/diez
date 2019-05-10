// TODO: Make internal
public final class FontRegistry: NSObject, Decodable {
    var files: [File]
    var registeredFiles: Set<File> = []

    init(files: [File]) {
        self.files = files
        super.init()
        self.registerFonts(with: files)
    }

    private enum CodingKeys: String, CodingKey {
        case files
    }

    private func registerFonts(with files: [File]) {
        files.forEach { file in
            if registeredFiles.contains(file) {
                return
            }

            registeredFiles.insert(file)

            guard
                let url = file.url,
                let data = try? Data(contentsOf: url) as CFData,
                let dataProvider = CGDataProvider(data: data),
                let cgFont = CGFont(dataProvider) else {
                    return
            }

            CTFontManagerRegisterGraphicsFont(cgFont, nil)
        }
    }
}

extension FontRegistry: Updatable {
    public func update(from decoder: Decoder) throws {
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &files, forKey: .files)
        // TODO: diff files, only register the new ones
        self.registerFonts(with: files)
    }
}
