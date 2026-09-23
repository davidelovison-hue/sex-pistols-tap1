import AVFoundation
import AppKit
import CoreVideo
import Foundation

struct Shot {
  let path: String
  /// 0 pins the top of the photo, 0.5 centers it.
  let anchor: CGFloat
}

let shots = [
  Shot(path: "public/artist-sex-pistols.jpg", anchor: 0.42),
  Shot(path: "public/artist-frank-carter.jpg", anchor: 0.18),
  Shot(path: "public/artist-steve-jones.jpg", anchor: 0.16),
  Shot(path: "public/artist-paul-cook.jpg", anchor: 0.12),
  Shot(path: "public/artist-glen-matlock.jpg", anchor: 0.14),
]

let width = 1280
let height = 720
let fps: Int32 = 30
let secondsPerShot = 3.2
let outputURL = URL(fileURLWithPath: "public/hero-sex-pistols.mp4")

func loadImage(_ path: String) -> CGImage {
  guard let image = NSImage(contentsOfFile: path),
        let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("Could not load \(path)\n", stderr)
    exit(1)
  }
  return cg
}

func frameBuffer(image: CGImage, zoom: CGFloat, anchor: CGFloat) -> CVPixelBuffer {
  var pixelBuffer: CVPixelBuffer?
  let status = CVPixelBufferCreate(
    kCFAllocatorDefault,
    width,
    height,
    kCVPixelFormatType_32BGRA,
    nil,
    &pixelBuffer
  )
  guard status == kCVReturnSuccess, let pixelBuffer else {
    fputs("Could not create pixel buffer\n", stderr)
    exit(1)
  }

  CVPixelBufferLockBaseAddress(pixelBuffer, [])
  defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, []) }

  guard let context = CGContext(
    data: CVPixelBufferGetBaseAddress(pixelBuffer),
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer),
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
  ) else {
    fputs("Could not create context\n", stderr)
    exit(1)
  }

  context.setFillColor(CGColor(gray: 0, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.interpolationQuality = .high

  let imageWidth = CGFloat(image.width)
  let imageHeight = CGFloat(image.height)
  let scale = max(CGFloat(width) / imageWidth, CGFloat(height) / imageHeight) * zoom
  let drawWidth = imageWidth * scale
  let drawHeight = imageHeight * scale
  let x = (CGFloat(width) - drawWidth) / 2
  let y = (CGFloat(height) - drawHeight) * (1 - anchor)
  context.draw(image, in: CGRect(x: x, y: y, width: drawWidth, height: drawHeight))
  return pixelBuffer
}

let images = shots.map { loadImage($0.path) }
try? FileManager.default.removeItem(at: outputURL)

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 2_200_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ],
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
  assetWriterInput: input,
  sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
  ]
)
writer.add(input)
guard writer.startWriting() else {
  fputs("startWriting failed: \(writer.error?.localizedDescription ?? "unknown")\n", stderr)
  exit(1)
}
writer.startSession(atSourceTime: .zero)

let framesPerShot = Int(secondsPerShot * Double(fps))
let queue = DispatchQueue(label: "hero-frames")
let done = DispatchSemaphore(value: 0)
var frameIndex = 0
var shotIndex = 0
var shotFrame = 0

input.requestMediaDataWhenReady(on: queue) {
  while input.isReadyForMoreMediaData {
    if shotIndex >= shots.count {
      input.markAsFinished()
      writer.finishWriting { done.signal() }
      return
    }

    let progress = CGFloat(shotFrame) / CGFloat(max(framesPerShot - 1, 1))
    let zoom = 1.0 + (0.06 * progress)
    let buffer = frameBuffer(image: images[shotIndex], zoom: zoom, anchor: shots[shotIndex].anchor)
    let time = CMTime(value: CMTimeValue(frameIndex), timescale: fps)
    if !adaptor.append(buffer, withPresentationTime: time) {
      fputs("append failed: \(writer.error?.localizedDescription ?? "unknown")\n", stderr)
      input.markAsFinished()
      writer.finishWriting { done.signal() }
      return
    }

    frameIndex += 1
    shotFrame += 1
    if shotFrame >= framesPerShot {
      shotFrame = 0
      shotIndex += 1
    }
  }
}

done.wait()
if writer.status != .completed {
  fputs("export failed: \(writer.error?.localizedDescription ?? writer.status.rawValue.description)\n", stderr)
  exit(1)
}
print("wrote \(outputURL.path) frames=\(frameIndex)")
