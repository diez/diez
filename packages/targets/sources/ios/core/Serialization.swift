// All credit to: https://stablekernel.com/understanding-extending-swift-4-codable/

/**
 Describes an model that can be updated from a `Decoder`.
 */
public protocol Updatable {
    mutating func update(from decoder: Decoder) throws
}

protocol DecodingFormat {
    func decoder(for data: Data) -> Decoder
}

extension DecodingFormat {
    func decode<T: Decodable>(_ type: T.Type, from data: Data) throws -> T {
        return try T.init(from: decoder(for: data))
    }
}

struct DecoderExtractor: Decodable {
    let decoder: Decoder

    init(from decoder: Decoder) throws {
        self.decoder = decoder
    }
}

extension JSONDecoder: DecodingFormat {
    func decoder(for data: Data) -> Decoder {
        // Can try! here because DecoderExtractor's init(from: Decoder) never throws
        return try! decode(DecoderExtractor.self, from: data).decoder
    }
}

extension PropertyListDecoder: DecodingFormat {
    func decoder(for data: Data) -> Decoder {
        // Can try! here because DecoderExtractor's init(from: Decoder) never throws
        return try! decode(DecoderExtractor.self, from: data).decoder
    }
}

extension DecodingFormat {
    func update<T: Updatable>(_ value: inout T, from data: Data) throws {
        try value.update(from: decoder(for: data))
    }
}

class NestedSingleValueDecodingContainer<Key: CodingKey>: SingleValueDecodingContainer {
    let container: KeyedDecodingContainer<Key>
    let key: Key
    var codingPath: [CodingKey] {
        return container.codingPath
    }

    init(container: KeyedDecodingContainer<Key>, key: Key) {
        self.container = container
        self.key = key
    }

    func decode(_ type: Bool.Type) throws -> Bool {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int.Type) throws -> Int {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int8.Type) throws -> Int8 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int16.Type) throws -> Int16 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int32.Type) throws -> Int32 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int64.Type) throws -> Int64 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt.Type) throws -> UInt {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt8.Type) throws -> UInt8 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt16.Type) throws -> UInt16 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt32.Type) throws -> UInt32 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt64.Type) throws -> UInt64 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Float.Type) throws -> Float {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Double.Type) throws -> Double {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: String.Type) throws -> String {
        return try container.decode(type, forKey: key)
    }

    func decode<T>(_ type: T.Type) throws -> T where T: Decodable {
        return try container.decode(type, forKey: key)
    }

    func decodeNil() -> Bool {
        return (try? container.decodeNil(forKey: key)) ?? false
    }
}

class NestedDecoder<Key: CodingKey>: Decoder {
    let container: KeyedDecodingContainer<Key>
    let key: Key

    init(from container: KeyedDecodingContainer<Key>, key: Key, userInfo: [CodingUserInfoKey: Any] = [:]) {
        self.container = container
        self.key = key
        self.userInfo = userInfo
    }

    var userInfo: [CodingUserInfoKey: Any]

    var codingPath: [CodingKey] {
        return container.codingPath
    }

    func container<Key>(keyedBy type: Key.Type) throws -> KeyedDecodingContainer<Key> where Key: CodingKey {
        return try container.nestedContainer(keyedBy: type, forKey: key)
    }

    func unkeyedContainer() throws -> UnkeyedDecodingContainer {
        return try container.nestedUnkeyedContainer(forKey: key)
    }

    func singleValueContainer() throws -> SingleValueDecodingContainer {
        return NestedSingleValueDecodingContainer(container: container, key: key)
    }
}

extension KeyedDecodingContainer {
    public func update<T: Updatable>(updatable: inout T, forKey key: Key, userInfo: [CodingUserInfoKey: Any] = [:]) throws {
        let nestedDecoder = NestedDecoder(from: self, key: key, userInfo: userInfo)
        try updatable.update(from: nestedDecoder)
    }

    public func update<T: Decodable>(value: inout T, forKey key: Key, userInfo: [CodingUserInfoKey: Any] = [:]) throws {
        guard let decodedValue = try decodeIfPresent(type(of: value), forKey: key) else { return }

        value = decodedValue
    }
}

extension Decoder {
    public func containerIfPresent<Key>(keyedBy type: Key.Type) throws -> KeyedDecodingContainer<Key>? where Key : CodingKey {
        do {
            return try container(keyedBy: type)
        } catch DecodingError.keyNotFound {
            return nil
        } catch {
            throw error
        }
    }
}
