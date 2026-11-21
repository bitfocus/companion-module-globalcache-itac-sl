## GlobalCache iTach IP2SL / GC-100

This module sends serial (RS-232) data through a GlobalCache iTach IP2SL, a serial port of a GC-100, or a computer running ser2net.

### Configuration

- Type in the IP address of the device.
- Set the port. The iTach IP2SL uses port 4999. On a GC-100, the first serial port is 4999, the second 5000.

Serial communication is 8 data bits and one stop bit. Parity, hardware flow control and baud rate (up to 115.2 Kbaud) are set on the device's own web page, as are Serial Multiconnection Mode, 7 data bit mode and 2 stop bit mode. If the serial settings don't match the connected device, buffer overflows (data loss) or parity errors will occur; these are shown on the device's Serial web page.

Make sure the baud rate, options and serial cable match your serial device.

![Serial Parameters](images/serial.jpg?raw=true 'serial parameters')

### Available Actions

- **Command**: sends the text as it is, without interpretation or conversion, followed by the selected line termination:
  - No termination
  - `\r` Carriage Return (default)
  - `\n` Line Feed
  - `\r\n` Carriage Return and Line Feed
- **HEX Command**: sends the hex values entered as bytes, e.g. `81 01 04 00 02 FF`. Characters other than 0-9 and A-F are ignored.

Both accept variables.

### Available Variables

- `response`: the last data received from the device, as text
- `response_hex`: the same data, as hex

Serial data has no message boundaries, so a long reply may arrive in more than one part, and the variables show the last part received. They are empty until data has been received.

### ser2net

The module also works with a computer running ser2net, for example a Raspberry Pi with a USB to RS-232 adapter (this has been used to control a camera with only an RS-232 VISCA port).

Configure the serial connection in ser2net, and set the module's port to the one ser2net listens on. An example ser2net line to forward raw VISCA hex commands to a camera with a 9600 baud serial port on port 4999:

`4999:raw:5:/dev/ttyUSB0:9600 8DATABITS NONE 1STOPBIT`
