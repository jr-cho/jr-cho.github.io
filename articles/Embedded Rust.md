# Embedded Rust: Building IoT Projects with Raspberry Pi and ESP32

## Introduction

The embedded systems landscape has been traditionally dominated by C and C++, but Rust has emerged as a compelling alternative that promises memory safety without sacrificing performance. This article explores how to leverage Rust's strengths in embedded development using a Raspberry Pi as your development platform and an ESP32 microcontroller as your deployment target.

Rust offers several key advantages for embedded development:

- **Memory safety without garbage collection**: Rust's ownership system prevents common bugs like null pointer dereferencing and buffer overflows at compile time.
- **Zero-cost abstractions**: Rust allows high-level programming constructs without runtime overhead.
- **Concurrency without data races**: Rust's type system guarantees thread safety.
- **Vibrant ecosystem**: Growing collection of libraries (crates) specifically designed for embedded systems.

The combination of a Raspberry Pi and ESP32 creates a powerful and flexible setup. The Raspberry Pi provides a Linux-based development environment with all the necessary tools, while the ESP32 offers Wi-Fi, Bluetooth, and numerous GPIO pins in an affordable package perfect for IoT applications.

## Setting Up Your Development Environment

### Preparing Your Raspberry Pi

First, ensure your Raspberry Pi is running the latest Raspberry Pi OS (formerly Raspbian). Open a terminal and run:

```bash
sudo apt update
sudo apt upgrade
```

Next, install the necessary tools for Rust development:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Choose the default installation option when prompted. After installation, add Rust to your current shell session:

```bash
source $HOME/.cargo/env
```

Install additional tools needed for cross-compilation:

```bash
sudo apt install git cmake ninja-build python3 python3-pip
pip3 install pyserial
```

### Setting Up ESP32 Toolchain

To compile Rust code for the ESP32, you'll need the Espressif toolchain:

```bash
git clone https://github.com/esp-rs/esp-idf-sys.git
cd esp-idf-sys
./install-rust-targets.sh
```

Add the ESP32 target to your Rust installation:

```bash
rustup target add xtensa-esp32-none-elf
```

### Connecting Your ESP32

Connect your ESP32 to the Raspberry Pi using a micro-USB cable. Verify the connection:

```bash
# Linux (e.g., Raspberry Pi)
ls /dev/ttyUSB*

# macOS
ls /dev/tty.*

# Windows (PowerShell)
Get-WmiObject Win32_SerialPort
```

You should see a device like `/dev/ttyUSB0`. May look different on Mac or Windows. Note this path for later use.

## Creating Your First Embedded Rust Project

Let's create a simple project that blinks an LED connected to the ESP32:

### Project Setup

Create a new Rust project:

```bash
cargo new esp32-blinky
cd esp32-blinky
```

Update your `Cargo.toml` file to include the necessary dependencies:

```toml
[package]
name = "esp32-blinky"
version = "0.1.0"
edition = "2021"

[dependencies]
esp-idf-sys = { version = "0.32", features = ["binstart"] }
esp-idf-hal = "0.40"
esp-idf-svc = "0.43"
embedded-hal = "0.2.7"
log = "0.4"

[build-dependencies]
embuild = "0.31"
```

Create a `.cargo/config.toml` file to configure the build settings:

```toml
[build]
target = "xtensa-esp32-none-elf"

[target.xtensa-esp32-none-elf]
runner = "espflash flash --monitor"
```

### Writing the Code

Replace the contents of `src/main.rs` with the following:

```rust
use esp_idf_hal::delay::FreeRtos;
use esp_idf_hal::gpio::{self, PinDriver};
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_sys as _;

fn main() -> anyhow::Result<()> {
    // Initialize the ESP-IDF system
    esp_idf_sys::link_patches();

    println!("ESP32 Rust Blinky!");

    // Get the peripherals
    let peripherals = Peripherals::take().unwrap();

    // Get the GPIO pin (GPIO2 is often connected to the onboard LED)
    let led_pin = peripherals.pins.gpio2;

    // Configure the pin as an output
    let mut led = PinDriver::output(led_pin)?;

    // Blink forever
    loop {
        // Turn the LED on
        led.set_high()?;
        println!("LED ON");

        // Wait for 1 second
        FreeRtos::delay_ms(1000);

        // Turn the LED off
        led.set_low()?;
        println!("LED OFF");

        // Wait for 1 second
        FreeRtos::delay_ms(1000);
    }
}
```

Create a `build.rs` file in the project root:

```rust
fn main() {
    embuild::build::CfgArgs::output_propagated("ESP_IDF").unwrap();
    embuild::build::LinkArgs::output_propagated("ESP_IDF").unwrap();
}
```

### Building and Flashing

Now, build and flash your code to the ESP32:

```bash
cargo build
espflash flash /dev/ttyUSB0 target/xtensa-esp32-none-elf/debug/esp32-blinky
```

If everything worked correctly, you should see the onboard LED of your ESP32 blinking at a 1-second interval.

## Communication Between Raspberry Pi and ESP32

One of the most common setups in IoT projects is to have a more powerful device (like a Raspberry Pi) communicate with simpler microcontrollers (like the ESP32). Let's explore how to establish communication between these two devices.

### UART Communication

UART (Universal Asynchronous Receiver/Transmitter) provides a simple serial communication method between the Pi and ESP32.

First, let's modify our ESP32 code to receive commands over UART:

```rust
use esp_idf_hal::delay::FreeRtos;
use esp_idf_hal::gpio::{self, PinDriver};
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_hal::uart::{config::Config, UartDriver};
use esp_idf_sys as _;
use std::time::Duration;

fn main() -> anyhow::Result<()> {
    // Initialize the ESP-IDF system
    esp_idf_sys::link_patches();

    println!("ESP32 UART Control!");

    // Get the peripherals
    let peripherals = Peripherals::take().unwrap();

    // Set up UART
    let uart_config = Config::default().baudrate(Hertz(115_200));
    let uart = UartDriver::new(
        peripherals.uart1,
        peripherals.pins.gpio17, // TX
        peripherals.pins.gpio16, // RX
        Option::<gpio::Gpio0>::None, // No RTS
        Option::<gpio::Gpio0>::None, // No CTS
        &uart_config,
    )?;

    // Get the GPIO pin for the LED
    let led_pin = peripherals.pins.gpio2;
    let mut led = PinDriver::output(led_pin)?;

    // Buffer for receiving data
    let mut buf = [0u8; 64];

    loop {
        // Read from UART
        if let Ok(n) = uart.read(&mut buf, Duration::from_millis(100)) {
            if n > 0 {
                // Process the command
                match buf[0] {
                    b'1' => {
                        led.set_high()?;
                        println!("LED ON");
                    },
                    b'0' => {
                        led.set_low()?;
                        println!("LED OFF");
                    },
                    _ => {}
                }
            }
        }

        // Short delay
        FreeRtos::delay_ms(10);
    }
}
```

Now, let's create a simple Rust program on the Raspberry Pi to send commands to the ESP32:

```rust
use std::io::{self, Write};
use std::time::Duration;
use serialport::SerialPort;

fn main() -> io::Result<()> {
    // Open the serial port
    let port = serialport::new("/dev/ttyUSB0", 115_200)
        .timeout(Duration::from_millis(1000))
        .open()
        .expect("Failed to open serial port");

    println!("Connected to ESP32. Send '1' to turn LED on, '0' to turn it off, 'q' to quit.");

    loop {
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;

        match input.trim() {
            "1" => {
                port.write_all(b"1")?;
                println!("Sent command to turn LED ON");
            },
            "0" => {
                port.write_all(b"0")?;
                println!("Sent command to turn LED OFF");
            },
            "q" => {
                println!("Exiting...");
                break;
            },
            _ => {
                println!("Invalid command. Use '1', '0', or 'q'.");
            }
        }
    }

    Ok(())
}
```

Save this as `raspi_uart_control.rs` and compile it with:

```bash
cargo new raspi_uart_control
cd raspi_uart_control
```

Update your `Cargo.toml`:

```toml
[package]
name = "raspi_uart_control"
version = "0.1.0"
edition = "2021"

[dependencies]
serialport = "4.2.0"
```

Then build and run:

```bash
cargo build
cargo run
```

With this setup, you can control the ESP32's LED from your Raspberry Pi through simple UART commands.

## Practical Example: Weather Station

Let's build a more complex example: a weather station that uses an ESP32 to collect temperature and humidity data, and a Raspberry Pi to process and display this information.

### ESP32 Sensor Code

For this example, we'll use a DHT22 sensor connected to the ESP32. Here's how to set it up:

```rust
use esp_idf_hal::delay::FreeRtos;
use esp_idf_hal::gpio;
use esp_idf_hal::peripherals::Peripherals;
use esp_idf_hal::uart::{config::Config, UartDriver};
use esp_idf_sys as _;
use dht_sensor::dht22;
use std::time::Duration;
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Serialize, Deserialize)]
struct SensorData {
    temperature: f32,
    humidity: f32,
    timestamp: u64,
}

fn main() -> anyhow::Result<()> {
    // Initialize the ESP-IDF system
    esp_idf_sys::link_patches();

    println!("ESP32 Weather Station!");

    // Get the peripherals
    let peripherals = Peripherals::take().unwrap();

    // Set up UART
    let uart_config = Config::default().baudrate(Hertz(115_200));
    let mut uart = UartDriver::new(
        peripherals.uart1,
        peripherals.pins.gpio17, // TX
        peripherals.pins.gpio16, // RX
        Option::<gpio::Gpio0>::None, // No RTS
        Option::<gpio::Gpio0>::None, // No CTS
        &uart_config,
    )?;

    // Set up DHT22 on GPIO pin 4
    let dht_pin = peripherals.pins.gpio4;

    // Simple timestamp counter (in seconds)
    let mut timestamp: u64 = 0;

    loop {
        // Read sensor data
        match dht22::Reading::read(dht_pin, &mut delay_ms) {
            Ok(reading) => {
                // Create a data structure
                let data = SensorData {
                    temperature: reading.temperature,
                    humidity: reading.relative_humidity,
                    timestamp,
                };

                // Serialize to JSON
                let json = serde_json::to_string(&data)?;

                // Send over UART
                uart.write(json.as_bytes())?;
                uart.write(b"\n")?;

                println!("Sent: {}", json);
            },
            Err(e) => {
                println!("Error reading sensor: {:?}", e);
            }
        }

        // Increment timestamp
        timestamp += 30;

        // Wait for 30 seconds before next reading
        FreeRtos::delay_ms(30000);
    }
}

// Helper function for DHT22 delay
fn delay_ms(ms: u16) {
    FreeRtos::delay_ms(ms.into());
}
```

Update your `Cargo.toml` to include the necessary dependencies:

```toml
[dependencies]
esp-idf-sys = { version = "0.32", features = ["binstart"] }
esp-idf-hal = "0.40"
esp-idf-svc = "0.43"
embedded-hal = "0.2.7"
dht-sensor = "0.2.1"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
log = "0.4"
anyhow = "1.0"
```

### Raspberry Pi Data Collector

On the Raspberry Pi, we'll create a program to collect, store, and visualize the data:

```rust
use std::fs::OpenOptions;
use std::io::{self, BufRead, BufReader, Write};
use std::time::{SystemTime, UNIX_EPOCH};
use serialport::SerialPort;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use plotters::prelude::*;

#[derive(Serialize, Deserialize, Clone)]
struct SensorData {
    temperature: f32,
    humidity: f32,
    timestamp: u64,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Open the serial port
    let port = serialport::new("/dev/ttyUSB0", 115_200)
        .timeout(std::time::Duration::from_millis(1000))
        .open()?;

    let reader = BufReader::new(port);
    let mut data_points: Vec<SensorData> = Vec::new();

    println!("Weather Station Data Collector");
    println!("Press Ctrl+C to generate chart and exit");

    // Open log file
    let mut log_file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("weather_data.csv")?;

    // Write header if file is empty
    if log_file.metadata()?.len() == 0 {
        writeln!(log_file, "timestamp,temperature,humidity")?;
    }

    // Process incoming data
    for line in reader.lines() {
        match line {
            Ok(line) => {
                match serde_json::from_str::<SensorData>(&line) {
                    Ok(data) => {
                        // Get current system time
                        let now = SystemTime::now()
                            .duration_since(UNIX_EPOCH)
                            .expect("Time went backwards")
                            .as_secs();

                        // Create a data point with current time
                        let data_with_time = SensorData {
                            temperature: data.temperature,
                            humidity: data.humidity,
                            timestamp: now,
                        };

                        // Display the data
                        let datetime: DateTime<Utc> = DateTime::from_timestamp(now as i64, 0)
                            .expect("Invalid timestamp");

                        println!("Time: {}", datetime.format("%Y-%m-%d %H:%M:%S"));
                        println!("Temperature: {:.1}°C", data.temperature);
                        println!("Humidity: {:.1}%", data.humidity);
                        println!("-----------------------");

                        // Log to file
                        writeln!(
                            log_file,
                            "{},{:.1},{:.1}",
                            datetime.format("%Y-%m-%d %H:%M:%S"),
                            data.temperature,
                            data.humidity
                        )?;

                        // Store for plotting
                        data_points.push(data_with_time);
                    },
                    Err(e) => {
                        eprintln!("Error parsing data: {}", e);
                    }
                }
            },
            Err(e) => {
                eprintln!("Error reading line: {}", e);
            }
        }
    }

    // If we got here, create a chart before exiting
    generate_chart(&data_points)?;

    Ok(())
}

fn generate_chart(data: &[SensorData]) -> Result<(), Box<dyn std::error::Error>> {
    if data.is_empty() {
        println!("No data to plot.");
        return Ok(());
    }

    let root = BitMapBackend::new("weather_chart.png", (800, 600)).into_drawing_area();
    root.fill(&WHITE)?;

    let mut chart_context = ChartBuilder::on(&root)
        .caption("Weather Data", ("sans-serif", 30).into_font())
        .margin(10)
        .set_label_area_size(LabelAreaPosition::Left, 60)
        .set_label_area_size(LabelAreaPosition::Bottom, 40)
        .build_cartesian_2d(
            data[0].timestamp..data[data.len() - 1].timestamp,
            0.0..100.0
        )?;

    chart_context.configure_mesh()
        .x_labels(5)
        .x_label_formatter(&|x| {
            let dt: DateTime<Utc> = DateTime::from_timestamp(*x as i64, 0)
                .expect("Invalid timestamp");
            dt.format("%H:%M").to_string()
        })
        .y_desc("Value")
        .draw()?;

    // Plot temperature
    chart_context.draw_series(
        LineSeries::new(
            data.iter().map(|d| (d.timestamp, d.temperature)),
            &RED,
        )
    )?
    .label("Temperature (°C)")
    .legend(|(x, y)| PathElement::new(vec![(x, y), (x + 20, y)], &RED));

    // Plot humidity
    chart_context.draw_series(
        LineSeries::new(
            data.iter().map(|d| (d.timestamp, d.humidity)),
            &BLUE,
        )
    )?
    .label("Humidity (%)")
    .legend(|(x, y)| PathElement::new(vec![(x, y), (x + 20, y)], &BLUE));

    chart_context.configure_series_labels()
        .background_style(&WHITE.mix(0.8))
        .border_style(&BLACK)
        .draw()?;

    println!("Chart generated: weather_chart.png");

    Ok(())
}
```

For the Raspberry Pi code, your `Cargo.toml` should include:

```toml
[package]
name = "weather_station"
version = "0.1.0"
edition = "2021"

[dependencies]
serialport = "4.2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = "0.4"
plotters = "0.3"
```

## Debugging Techniques

Debugging embedded systems can be challenging due to limited resources and access. Here are several approaches to debugging your Rust-based ESP32 applications:

### Serial Logging

The simplest form of debugging uses print statements to output information over serial:

```rust
println!("Debug: value = {}", some_value);
```

You can enhance this with the `log` crate for different log levels:

```rust
use log::{info, warn, error, debug};

fn some_function() {
    debug!("Detailed debug information");
    info!("Something happened: {}", event);
    warn!("Warning: battery low");
    error!("Critical error: {}", error_message);
}
```

To enable logging, add this to your main function:

```rust
esp_idf_svc::log::EspLogger::initialize_default();

```

### Remote Debugging with GDB

For more complex debugging, you can use GDB (the GNU Debugger):

1. Install the OpenOCD (Open On-Chip Debugger):

```bash
sudo apt-get install openocd
```

1. Configure OpenOCD for ESP32 by creating a file named `esp32.cfg`:

```
interface ftdi
ftdi_vid_pid 0x0403 0x6010
ftdi_layout_init 0x0008 0x000b
transport select jtag
adapter_khz 200

set ESP32_RTOS "FreeRTOS"
set ESP32_FLASH_VOLTAGE 3.3

source [find target/esp32.cfg]
```

1. Connect a JTAG adapter to your ESP32 and run OpenOCD:

```bash
sudo openocd -f esp32.cfg
```

1. In another terminal, start GDB:

```bash
xtensa-esp32-elf-gdb target/xtensa-esp32-none-elf/debug/your_program
```

1. Connect to OpenOCD:

```
(gdb) target remote :3333
(gdb) monitor reset halt
(gdb) thb main
(gdb) continue
```

### Core Dumps

ESP-IDF supports core dumps, which can be helpful for post-mortem debugging:

```rust
use esp_idf_sys::{esp_core_dump_init, ESP_COREDUMP_ENABLE_FLASH_ONLY};

fn main() {
    // Initialize core dump
    unsafe {
        esp_core_dump_init(ESP_COREDUMP_ENABLE_FLASH_ONLY);
    }

    // Rest of your code...
}
```

When a panic occurs, the ESP32 will save a core dump to flash memory that can be analyzed later.

## Performance Considerations

When working with embedded Rust on the ESP32, consider these performance optimizations:

### Memory Management

The ESP32 has limited memory, so use it wisely:

1. **Avoid dynamic allocation**: Use static or stack allocation when possible
2. **Consider `no_std` environments**: For extremely constrained scenarios
3. **Use `Box<T>` sparingly**: Only when you need heap allocation

### Optimization Flags

Configure your `Cargo.toml` to optimize for size:

```toml
[profile.release]
opt-level = "z"       # Optimize for size
lto = true            # Link-time optimization
codegen-units = 1     # Reduce parallel code generation units
panic = "abort"       # Abort on panic (saves size)
strip = true          # Strip symbols from binary
```

### Power Management

Incorporate power saving techniques for battery-operated devices:

```rust
use esp_idf_hal::delay::FreeRtos;
use esp_idf_sys::{esp_sleep_enable_timer_wakeup, esp_light_sleep_start};

fn main() {
    // Setup code...

    loop {
        // Do your work

        // Put device to sleep for 10 seconds (microseconds)
        unsafe {
            esp_sleep_enable_timer_wakeup(10_000_000);
            esp_light_sleep_start();
        }
    }
}
```

## Conclusion

Rust brings a refreshing approach to embedded development with its emphasis on safety and performance. The combination of Raspberry Pi as a development platform and ESP32 as a target device creates a powerful and versatile setup for a wide range of IoT applications.

In this article, we explored setting up the development environment, creating simple projects, establishing communication between devices, building a practical weather station application, and implementing debugging and optimization techniques.

Embedded Rust development is still evolving, but the ecosystem is maturing rapidly. As more libraries and tools become available, Rust is poised to become a leading language for developing reliable and efficient embedded systems.

## Further Resources

- [The Embedded Rust Book](https://docs.rust-embedded.org/book/)
- [ESP-RS Documentation](https://github.com/esp-rs)
- [Rust on ESP Book](https://esp-rs.github.io/book/)
- [Embedded HAL Crate](https://crates.io/crates/embedded-hal)
- [ESP-IDF-HAL Crate](https://crates.io/crates/esp-idf-hal)

With these resources and the techniques covered in this article, you have everything you need to start your journey into embedded Rust development with Raspberry Pi and ESP32. Happy coding!