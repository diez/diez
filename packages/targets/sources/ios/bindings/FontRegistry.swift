private var registeredFiles: Set<File> = []

extension FontRegistry {
    @objc public func registerFonts() {
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
