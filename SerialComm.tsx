import {
  UsbSerialManager,
  UsbSerial,
  Parity,
} from 'react-native-usb-serialport-for-android';
import {ScrollView, Alert, Button} from 'react-native';
import {useLayoutEffect, useState} from 'react';

const SerialPortComponent = () => {
  const [usbSerial, setUsbSerial] = useState(null);
  useLayoutEffect(() => {
    initSerialPort();
  }, []);

  async function initSerialPort() {
    try {
      // check for the available devices
      const devices = await UsbSerialManager.list();
      // Send request for the first available device
      const granted = await UsbSerialManager.tryRequestPermission(
        devices[0].deviceId,
      );
      if (granted) {
        // open the port for communication
        const usbSerialport = await UsbSerialManager.open(devices[0].deviceId, {
          baudRate: 9600,
          parity: Parity.None,
          dataBits: 8,
          stopBits: 1,
        });
        setUsbSerial(usbSerialport);
      } else {
        Alert.alert('USB permission denied');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendData(data) {
    if (usbSerial) {
      try {
        await usbSerial.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return (
    <ScrollView>
      <Button onPress={() => sendData('0x01')} title="ON" />
      <Button onPress={() => sendData('0x02')} title="OFF" />
    </ScrollView>
  );
};

export default SerialPortComponent;
