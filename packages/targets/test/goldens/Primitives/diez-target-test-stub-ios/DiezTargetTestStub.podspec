# coding: utf-8
version = '10.10.10'

Pod::Spec.new do |s|
  s.name = 'DiezTargetTestStub'
  s.version = version
  s.summary = 'Diez Design System'
  s.description = <<-DESC
                    Diez design system.
                  DESC
  s.license = 'MIT'
  s.author = 'Diez'
  s.homepage = 'https://diez.org'
  s.source = { :git => 'https://github.com/diez/diez' }
  s.platforms = { :ios => '11' }
  s.source_files = 'Sources/DiezTargetTestStub/**/*.swift'
  s.framework = 'UIKit', 'WebKit'
  # TODO: s.ios.source_files and s.ios.framework for iOS, s.osx.* for macOS, and so on
end
