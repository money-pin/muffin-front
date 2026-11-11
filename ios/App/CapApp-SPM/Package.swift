// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.5.2"),
        .package(name: "CapgoCapacitorSocialLogin", path: "../../../node_modules/.pnpm/@capgo+capacitor-social-login@8.7.6_@capacitor+core@8.5.2/node_modules/@capgo/capacitor-social-login"),
        .package(name: "TeamLepisodeCapacitorKakaoLogin", path: "../../../node_modules/.pnpm/@team-lepisode+capacitor-kakao-login@8.1.0_patch_hash=41110a2771b32bfa609fefa3fd228f2b9_d9b83697840c8a9a8bc5b435269f90b4/node_modules/@team-lepisode/capacitor-kakao-login")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapgoCapacitorSocialLogin", package: "CapgoCapacitorSocialLogin"),
                .product(name: "TeamLepisodeCapacitorKakaoLogin", package: "TeamLepisodeCapacitorKakaoLogin")
            ]
        )
    ]
)
