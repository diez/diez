# coding: utf-8
version = '{{{sdkVersion}}}'

Pod::Spec.new do |s|
  s.name = '{{{moduleName}}}'
  s.version = version
  s.summary = 'Diez Design System'
  s.description = <<-DESC
                    Diez design language.
                  DESC
  s.license = 'MIT'
  s.author = 'Diez'
  s.homepage = 'https://diez.org'
  s.source = { :git => 'https://github.com/diez/diez' }
  s.platforms = { :ios => '11' }
  {{#each dependencies}}
  s.dependency '{{{this.cocoapods.name}}}', '{{{this.cocoapods.versionConstraint}}}'
  {{/each}}
  s.source_files = 'Sources/{{{moduleName}}}/**/*.swift'
  s.framework = 'UIKit', 'WebKit'
  # TODO: s.ios.source_files and s.ios.framework for iOS, s.osx.* for macOS, and so on
  {{#if hasStaticAssets}}
  s.resource_bundles = {
    'Static' => ['Sources/Static/**']
  }
  {{/if}}
end
