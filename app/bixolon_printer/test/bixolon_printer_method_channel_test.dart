import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bixolon_printer/bixolon_printer_method_channel.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  MethodChannelBixolonPrinter platform = MethodChannelBixolonPrinter();
  const MethodChannel channel = MethodChannel('bixolon_printer');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
      channel,
      (MethodCall methodCall) async {
        return '42';
      },
    );
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });

  test('getPlatformVersion', () async {});
}
