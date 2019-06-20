import Foundation

extension Bundle {
    func url(forFile file: File) -> URL? {
        return url(forResource: file.src.removingPercentEncoding, withExtension: nil)
    }
}
