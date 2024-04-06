/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {
  UsbSerialManager,
  Parity,
  UsbSerial,
} from 'react-native-usb-serialport-for-android';

function App(): React.JSX.Element {
  const [serialConn, setSerialConn] = useState<UsbSerial>();
  const [H, setH] = useState(0);

  async function connectSerialPort() {
    try {
      // check for the available devices
      UsbSerialManager.list().then(devices => {
        Alert.alert(devices[0].deviceId.toString());
        // Send request for the first available device
        UsbSerialManager.tryRequestPermission(devices[0].deviceId).then(
          granted => {
            if (granted) {
              //connect to 1st device (usually phones have only 1 usb port)
              UsbSerialManager.open(devices[0].deviceId, {
                baudRate: 115200,
                parity: Parity.None,
                dataBits: 8,
                stopBits: 1,
              }).then(port => {
                setSerialConn(port);
                serialConn?.send('hello world');
              });
            }
          },
        );
      });
      // open the port for communication
    } catch (err: any) {
      Alert.alert(err);
    }
  }

  async function sendData(data: any) {
    if (serialConn?.deviceId) {
      serialConn.send(data);
    }
  }
  // async function getDeviceList() {
  //   setDeviceList(await UsbSerialManager.list());
  //   try {
  //     await UsbSerialManager.tryRequestPermission(2004);
  //     const usbSerialport = await UsbSerialManager.open(2004, {
  //       baudRate: 115200,
  //       parity: Parity.None,
  //       dataBits: 8,
  //       stopBits: 1,
  //     });

  //     await usbSerialport.send('hello');

  //     usbSerialport.close();
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }

  // useEffect(() => {
  //   getDeviceList();
  // }, []);

  // useEffect(() => {
  //   getDeviceList();

  //   // const data = {
  //   //   direction: 'F',
  //   //   value: H,
  //   // };

  //   // if (usbSerialport.current) {
  //   //   usbSerialport.current.send(data.value);
  //   // }
  // }, [H]);

  // useEffect(() => {
  //   const data = {
  //     direction: 'F',
  //     value: 'hello',
  //   };

  //   if (usbSerialport.current) {
  //     setInterval(() => usbSerialport.current.send(data.value), 1000);
  //   }
  // }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          {serialConn ? (
            <View>
              <Text>Connected to {serialConn.deviceId}</Text>
              <Slider
                value={H}
                maximumValue={100}
                minimumValue={-100}
                onValueChange={v => {
                  setH(v[0]);
                  sendData(v[0]);
                }}
              />
              <Button onPress={() => sendData('hi')} title="Hi" />
            </View>
          ) : (
            <Button onPress={() => connectSerialPort()} title="Connect" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
