# coding: utf-8
version = '10.10.10'

Pod::Spec.new do |s|
  s.name = 'DiezStub'
  s.version = version
  s.summary = 'Diez Design System'
  s.description = <<-DESC
                    Diez design system.
                  DESC
  s.license = 'MIT'
  s.author = 'Diez'
  s.homepage = 'https://diez.org'
  s.source = { :git => 'https://github.com/diez/diez' }
  # TODO: What are these, actually?
  s.platforms = { :ios => '12.1' }
  # TODO: Support new Lottie iOS
  s.source_files = 'Sources/DiezStub/**/*.swift'
  s.framework = 'UIKit', 'WebKit'
  # TODO: s.ios.source_files and s.ios.framework for iOS, s.osx.* for macOS, and so on
end
