import Foundation

protocol ReflectedCustomStringConvertible: AnyObject {
    var reflectedDescription: String { get }
}

extension ReflectedCustomStringConvertible {
    var reflectedDescription: String {
        // TODO: Optimize and cleanup
        let propertyLines = Mirror(reflecting: self).children.compactMap { child -> String? in
            guard let name = child.label else {
                return nil
            }

            var valueDescription = "\(child.value)"
            if valueDescription.range(of: "\n") != nil {
                valueDescription = "\n    " + valueDescription.replacingOccurrences(of: "\n", with: "\n    ")
            }

            return "\(name): \(valueDescription)"
        }

        let joinedPropertyLines = propertyLines.joined(separator: ",\n  ")

        let typeDescription = "(\(NSStringFromClass(type(of: self))) - \(Unmanaged.passUnretained(self).toOpaque()))"

        return "<\(typeDescription) \n  \(joinedPropertyLines)>"
    }
}
