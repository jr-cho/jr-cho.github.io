# Embedded C: Building IoT Projects with Raspberry Pi and ESP32

## Introduction

Embedded C programming remains the backbone of the embedded systems world, powering everything from simple microcontrollers to complex IoT devices. This article explores how to leverage C's strengths in embedded development using a Raspberry Pi as your development platform and an ESP32 microcontroller as your deployment target.

C offers several key advantages for embedded development:

- **Efficiency and performance**: C provides low-level control with minimal overhead, making it ideal for resource-constrained devices.
- **Direct hardware access**: C allows direct manipulation of hardware registers and memory locations.
- **Mature ecosystem**: Decades of libraries, tools, and community support make C a reliable choice.
- **Industry standard**: C remains the most widely used language in embedded systems, with extensive documentation and examples.

The combination of a Raspberry Pi and ESP32 creates a powerful and flexible setup. The Raspberry Pi provides a Linux-based development environment with all the necessary tools, while the ESP32 offers Wi-Fi, Bluetooth, and numerous GPIO pins in an affordable package perfect for IoT applications.

## Setting Up Your Development Environment

### Preparing Your Raspberry Pi

First, ensure your Raspberry Pi is running the latest Raspberry Pi OS (formerly Raspbian). Open a terminal and run:

```bash
sudo apt update
sudo apt upgrade
```

Next, install the necessary tools for C development:

```bash
sudo apt install build-essential git cmake python3 python3-pip
```

### Setting Up ESP32 Toolchain

To compile C code for the ESP32, you'll need the Espressif IoT Development Framework (ESP-IDF):

```bash
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
git checkout release/v4.4
git submodule update --init --recursive
./install.sh
```

After installation, set up the environment variables:

```bash
. $HOME/esp/esp-idf/export.sh
```

To make this permanent, add it to your `.bashrc` file:

```bash
echo ". $HOME/esp/esp-idf/export.sh" >> ~/.bashrc
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

Set permissions for the serial port:

```bash
sudo usermod -a -G dialout $USER
```

You might need to log out and log back in for this change to take effect.

## Creating Your First Embedded C Project

Let's create a simple project that blinks an LED connected to the ESP32:

### Project Setup

Create a new project using the ESP-IDF template:

```bash
cd ~/esp
idf.py create-project blinky
cd blinky
```

This will create a basic project structure. Now let's modify the main file:

```bash
cd main
```

Edit the `blinky_main.c` file:

```c
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

#define LED_PIN 2  // GPIO2 is often connected to the onboard LED

static const char *TAG = "BLINKY";

void app_main(void)
{
    ESP_LOGI(TAG, "ESP32 Blinky Example");

    // Configure LED pin as output
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);

    while (1) {
        // Turn the LED on
        gpio_set_level(LED_PIN, 1);
        ESP_LOGI(TAG, "LED ON");
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // 1 second delay

        // Turn the LED off
        gpio_set_level(LED_PIN, 0);
        ESP_LOGI(TAG, "LED OFF");
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // 1 second delay
    }
}
```

Now update the `CMakeLists.txt` file in the main directory:

```
idf_component_register(SRCS "blinky_main.c"
                       INCLUDE_DIRS ".")
```

### Building and Flashing

Navigate back to your project root directory and build the project:

```bash
cd ~/esp/blinky
idf.py build
```

Flash the compiled code to your ESP32:

```bash
idf.py -p /dev/ttyUSB0 flash
```

To see the serial output:

```bash
idf.py -p /dev/ttyUSB0 monitor
```

Press `Ctrl+]` to exit the monitor.

If everything worked correctly, you should see the onboard LED of your ESP32 blinking at a 1-second interval, and the serial monitor should display "LED ON" and "LED OFF" messages.

## Understanding the ESP-IDF Framework

The ESP-IDF (Espressif IoT Development Framework) provides a structured approach to ESP32 programming. Let's examine its key components:

### FreeRTOS Integration

ESP-IDF uses FreeRTOS, a real-time operating system that enables multitasking:

```c
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void app_main(void)
{
    // Create tasks
    xTaskCreate(
        led_task,         // Task function
        "LED_TASK",       // Name for debugging
        2048,             // Stack size (bytes)
        NULL,             // Parameters
        5,                // Priority
        NULL              // Task handle
    );

    // Main task can now end, FreeRTOS scheduler will take over
}

void led_task(void *pvParameters)
{
    while (1) {
        // Task code here
        vTaskDelay(pdMS_TO_TICKS(1000));  // 1 second delay
    }
}
```

### Component-Based Architecture

ESP-IDF organizes code into components, making projects modular and maintainable:

```
my_project/
  ├── CMakeLists.txt
  ├── main/
  │   ├── CMakeLists.txt
  │   └── main.c
  └── components/
      └── my_component/
          ├── CMakeLists.txt
          ├── include/
          │   └── my_component.h
          └── my_component.c
```

To create a custom component:

```bash
mkdir -p components/my_component/include
touch components/my_component/CMakeLists.txt
touch components/my_component/my_component.c
touch components/my_component/include/my_component.h
```

Edit the component's `CMakeLists.txt`:

```
idf_component_register(SRCS "my_component.c"
                       INCLUDE_DIRS "include")
```

## Communication Between Raspberry Pi and ESP32

One of the most common setups in IoT projects is to have a more powerful device (like a Raspberry Pi) communicate with simpler microcontrollers (like the ESP32). Let's explore how to establish communication between these two devices.

### UART Communication

UART (Universal Asynchronous Receiver/Transmitter) provides a simple serial communication method between the Pi and ESP32.

First, let's create a program on the ESP32 to receive commands over UART:

```c
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/uart.h"
#include "esp_log.h"

#define LED_PIN         2
#define UART_NUM        UART_NUM_1
#define UART_TX_PIN     17
#define UART_RX_PIN     16
#define BUF_SIZE        128

static const char *TAG = "UART_CONTROL";

void app_main(void)
{
    ESP_LOGI(TAG, "ESP32 UART Control Example");

    // Configure LED pin
    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);

    // Configure UART
    uart_config_t uart_config = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_APB,
    };

    // Install UART driver
    ESP_ERROR_CHECK(uart_driver_install(UART_NUM, BUF_SIZE * 2, 0, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(UART_NUM, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(UART_NUM, UART_TX_PIN, UART_RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));

    // Buffer for incoming data
    uint8_t data[BUF_SIZE];

    while (1) {
        // Read data from UART
        int len = uart_read_bytes(UART_NUM, data, BUF_SIZE - 1, 100 / portTICK_PERIOD_MS);

        if (len > 0) {
            data[len] = '\0';  // Null-terminate the string
            ESP_LOGI(TAG, "Received: %s", data);

            // Process command
            if (data[0] == '1') {
                gpio_set_level(LED_PIN, 1);
                ESP_LOGI(TAG, "LED ON");
            }
            else if (data[0] == '0') {
                gpio_set_level(LED_PIN, 0);
                ESP_LOGI(TAG, "LED OFF");
            }
        }

        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}
```

Now, let's create a C program on the Raspberry Pi to send commands to the ESP32:

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>

int set_interface_attribs(int fd, int speed)
{
    struct termios tty;

    if (tcgetattr(fd, &tty) < 0) {
        printf("Error from tcgetattr: %s\n", strerror(errno));
        return -1;
    }

    cfsetospeed(&tty, speed);
    cfsetispeed(&tty, speed);

    tty.c_cflag |= (CLOCAL | CREAD);    // Ignore modem controls
    tty.c_cflag &= ~CSIZE;
    tty.c_cflag |= CS8;                 // 8-bit characters
    tty.c_cflag &= ~PARENB;             // No parity bit
    tty.c_cflag &= ~CSTOPB;             // One stop bit
    tty.c_cflag &= ~CRTSCTS;            // No hardware flowcontrol

    // Setup for non-canonical mode
    tty.c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL | IXON);
    tty.c_lflag &= ~(ECHO | ECHONL | ICANON | ISIG | IEXTEN);
    tty.c_oflag &= ~OPOST;

    // Fetch bytes as they become available
    tty.c_cc[VMIN] = 1;
    tty.c_cc[VTIME] = 1;

    if (tcsetattr(fd, TCSANOW, &tty) != 0) {
        printf("Error from tcsetattr: %s\n", strerror(errno));
        return -1;
    }
    return 0;
}

int main()
{
    char *portname = "/dev/ttyUSB0";
    char input[10];

    // Open serial port
    int fd = open(portname, O_RDWR | O_NOCTTY | O_SYNC);
    if (fd < 0) {
        printf("Error opening %s: %s\n", portname, strerror(errno));
        return -1;
    }

    // Set interface attributes
    set_interface_attribs(fd, B115200);

    printf("Connected to ESP32. Send '1' to turn LED on, '0' to turn it off, 'q' to quit.\n");

    while(1) {
        printf("Enter command: ");
        fgets(input, sizeof(input), stdin);

        switch(input[0]) {
            case '1':
                write(fd, "1", 1);
                printf("Sent command to turn LED ON\n");
                break;
            case '0':
                write(fd, "0", 1);
                printf("Sent command to turn LED OFF\n");
                break;
            case 'q':
                printf("Exiting...\n");
                close(fd);
                return 0;
            default:
                printf("Invalid command. Use '1', '0', or 'q'.\n");
        }
    }

    return 0;
}
```

Compile the Raspberry Pi program:

```bash
gcc -o uart_control uart_control.c
```

Run it:

```bash
./uart_control
```

With this setup, you can control the ESP32's LED from your Raspberry Pi through simple UART commands.

## Practical Example: Weather Station

Let's build a more complex example: a weather station that uses an ESP32 to collect temperature and humidity data, and a Raspberry Pi to process and display this information.

### ESP32 Sensor Code

For this example, we'll use a DHT22 sensor connected to the ESP32:

```c
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/uart.h"
#include "esp_log.h"
#include "dht.h"
#include "cJSON.h"
#include "esp_timer.h"

#define DHT_PIN         4
#define UART_NUM        UART_NUM_1
#define UART_TX_PIN     17
#define UART_RX_PIN     16
#define BUF_SIZE        256

static const char *TAG = "WEATHER_STATION";
static const dht_sensor_type_t sensor_type = DHT_TYPE_DHT22;

void app_main(void)
{
    ESP_LOGI(TAG, "ESP32 Weather Station Example");

    // Configure UART
    uart_config_t uart_config = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_APB,
    };

    // Install UART driver
    ESP_ERROR_CHECK(uart_driver_install(UART_NUM, BUF_SIZE * 2, 0, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(UART_NUM, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(UART_NUM, UART_TX_PIN, UART_RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));

    // Initialize DHT sensor
    ESP_ERROR_CHECK(dht_init(DHT_PIN, sensor_type));

    // Buffer for data
    char json_data[BUF_SIZE];

    while (1) {
        float temperature, humidity;

        // Read sensor data
        if (dht_read_float_data(sensor_type, DHT_PIN, &humidity, &temperature) == ESP_OK) {
            ESP_LOGI(TAG, "Temperature: %.1f°C, Humidity: %.1f%%", temperature, humidity);

            // Create JSON data structure
            cJSON *root = cJSON_CreateObject();
            cJSON_AddNumberToObject(root, "temperature", temperature);
            cJSON_AddNumberToObject(root, "humidity", humidity);
            cJSON_AddNumberToObject(root, "timestamp", esp_timer_get_time() / 1000000); // seconds since boot

            // Convert to string
            char *json_str = cJSON_Print(root);
            sprintf(json_data, "%s\n", json_str);

            // Send over UART
            uart_write_bytes(UART_NUM, json_data, strlen(json_data));
            ESP_LOGI(TAG, "Sent: %s", json_data);

            // Free resources
            free(json_str);
            cJSON_Delete(root);
        } else {
            ESP_LOGE(TAG, "Error reading sensor data");
        }

        // Wait for 30 seconds before next reading
        vTaskDelay(30000 / portTICK_PERIOD_MS);
    }
}
```

Add the required components to your project's `CMakeLists.txt`:

```
idf_component_register(SRCS "weather_station_main.c"
                       INCLUDE_DIRS "."
                       REQUIRES dht json)
```

You'll need to install the DHT component:

```bash
cd ~/esp/weather_station/components
git clone https://github.com/UncleRus/esp-idf-lib.git
```

### Raspberry Pi Data Collector

On the Raspberry Pi, we'll create a program to collect, store, and visualize the data:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>
#include <time.h>
#include <errno.h>
#include <signal.h>
#include <json-c/json.h>

#define BUFFER_SIZE 256

// Global variables for signal handling
int run = 1;
FILE *log_file = NULL;

// Signal handler for Ctrl+C
void handle_signal(int sig)
{
    run = 0;
    printf("\nExiting...\n");
    if (log_file) {
        fclose(log_file);
    }
}

int set_interface_attribs(int fd, int speed)
{
    struct termios tty;

    if (tcgetattr(fd, &tty) < 0) {
        printf("Error from tcgetattr: %s\n", strerror(errno));
        return -1;
    }

    cfsetospeed(&tty, speed);
    cfsetispeed(&tty, speed);

    tty.c_cflag |= (CLOCAL | CREAD);
    tty.c_cflag &= ~CSIZE;
    tty.c_cflag |= CS8;
    tty.c_cflag &= ~PARENB;
    tty.c_cflag &= ~CSTOPB;
    tty.c_cflag &= ~CRTSCTS;

    tty.c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL | IXON);
    tty.c_lflag &= ~(ECHO | ECHONL | ICANON | ISIG | IEXTEN);
    tty.c_oflag &= ~OPOST;

    tty.c_cc[VMIN] = 0;
    tty.c_cc[VTIME] = 10;

    if (tcsetattr(fd, TCSANOW, &tty) != 0) {
        printf("Error from tcsetattr: %s\n", strerror(errno));
        return -1;
    }
    return 0;
}

int main()
{
    char *portname = "/dev/ttyUSB0";
    char buffer[BUFFER_SIZE];
    char timestamp_buf[64];
    time_t now;
    struct tm *timeinfo;

    // Set up signal handling
    signal(SIGINT, handle_signal);

    // Open serial port
    int fd = open(portname, O_RDWR | O_NOCTTY | O_SYNC);
    if (fd < 0) {
        printf("Error opening %s: %s\n", portname, strerror(errno));
        return -1;
    }

    // Set interface attributes
    set_interface_attribs(fd, B115200);

    // Open log file
    log_file = fopen("weather_data.csv", "a");
    if (!log_file) {
        printf("Error opening log file: %s\n", strerror(errno));
        close(fd);
        return -1;
    }

    // Write header if file is empty
    fseek(log_file, 0, SEEK_END);
    if (ftell(log_file) == 0) {
        fprintf(log_file, "timestamp,temperature,humidity\n");
    }

    printf("Weather Station Data Collector\n");
    printf("Press Ctrl+C to exit\n");

    // Main loop
    while (run) {
        // Read from serial port
        memset(buffer, 0, BUFFER_SIZE);
        int n = read(fd, buffer, BUFFER_SIZE - 1);

        if (n > 0) {
            buffer[n] = '\0';

            // Try to parse JSON
            struct json_object *json_obj = json_tokener_parse(buffer);
            if (json_obj) {
                struct json_object *temp_obj, *humid_obj;

                if (json_object_object_get_ex(json_obj, "temperature", &temp_obj) &&
                    json_object_object_get_ex(json_obj, "humidity", &humid_obj)) {

                    double temperature = json_object_get_double(temp_obj);
                    double humidity = json_object_get_double(humid_obj);

                    // Get current time
                    time(&now);
                    timeinfo = localtime(&now);
                    strftime(timestamp_buf, sizeof(timestamp_buf), "%Y-%m-%d %H:%M:%S", timeinfo);

                    // Display the data
                    printf("Time: %s\n", timestamp_buf);
                    printf("Temperature: %.1f°C\n", temperature);
                    printf("Humidity: %.1f%%\n", humidity);
                    printf("-----------------------\n");

                    // Log to file
                    fprintf(log_file, "%s,%.1f,%.1f\n", timestamp_buf, temperature, humidity);
                    fflush(log_file);
                }

                // Free JSON object
                json_object_put(json_obj);
            }
        }

        // Small delay
        usleep(100000);  // 100ms
    }

    // Close serial port
    close(fd);

    return 0;
}
```

Install the required dependencies on the Raspberry Pi:

```bash
sudo apt install libjson-c-dev gnuplot
```

Compile the Raspberry Pi program:

```bash
gcc -o weather_station weather_station.c -ljson-c
```

Run it:

```bash
./weather_station
```

### Visualizing the Data

Let's create a simple script to visualize the data using Gnuplot:

```bash
#!/bin/bash

# Create a Gnuplot script
cat > plot_weather.gp << EOF
set terminal png size 800,600
set output 'weather_chart.png'
set title 'Weather Station Data'
set xlabel 'Time'
set ylabel 'Value'
set xdata time
set timefmt '%Y-%m-%d %H:%M:%S'
set format x '%H:%M'
set grid
set key outside
plot 'weather_data.csv' using 1:2 with lines title 'Temperature (°C)', \
     'weather_data.csv' using 1:3 with lines title 'Humidity (%)'
EOF

# Run Gnuplot
gnuplot plot_weather.gp

echo "Chart generated: weather_chart.png"
```

Save this as `plot_weather.sh` and make it executable:

```bash
chmod +x plot_weather.sh
```

Run it to generate a chart:

```bash
./plot_weather.sh
```

## Debugging Techniques

Debugging embedded systems can be challenging due to limited resources and access. Here are several approaches to debugging your C-based ESP32 applications:

### Serial Logging

The ESP-IDF provides a logging module that sends output over serial:

```c
#include "esp_log.h"

static const char *TAG = "MY_MODULE";

void some_function(void)
{
    ESP_LOGE(TAG, "Error occurred!");              // Error level
    ESP_LOGW(TAG, "Warning: %d", warning_value);   // Warning level
    ESP_LOGI(TAG, "Info message");                 // Info level
    ESP_LOGD(TAG, "Debug message");                // Debug level
    ESP_LOGV(TAG, "Verbose message");              // Verbose level
}
```

You can control the log level using menuconfig:

```bash
idf.py menuconfig
```

Navigate to "Component config" > "Log output" to set the default log level.

### GDB Debugging

For more complex debugging, you can use GDB (the GNU Debugger):

1. Compile your project with debugging information:

```bash
idf.py build
```

1. Flash and start GDB server:

```bash
idf.py flash
idf.py openocd
```

1. In another terminal, start GDB:

```bash
xtensa-esp32-elf-gdb -x gdbinit build/your_project.elf
```

1. Set breakpoints and debug as needed:

```
(gdb) b app_main
(gdb) c
```

### Core Dumps

ESP-IDF supports core dumps, which can be helpful for post-mortem debugging:

Enable core dumps in menuconfig:

```bash
idf.py menuconfig
```

Navigate to "Component config" > "ESP32-specific" > "Core dump" and select "Flash" as the destination.

When a crash occurs, you can extract and analyze the core dump:

```bash
idf.py coredump-info
```

### Memory Debugging

The ESP-IDF provides tools for tracking memory usage and detecting leaks:

```c
#include "esp_heap_trace.h"

#define NUM_RECORDS 100
static heap_trace_record_t trace_record[NUM_RECORDS];

void app_main(void)
{
    // Initialize heap tracing
    ESP_ERROR_CHECK(heap_trace_init_standalone(trace_record, NUM_RECORDS));

    // Start tracing
    ESP_ERROR_CHECK(heap_trace_start(HEAP_TRACE_LEAKS));

    // Your code here

    // Stop tracing
    ESP_ERROR_CHECK(heap_trace_stop());

    // Dump heap trace
    heap_trace_dump();
}
```

## Performance Considerations

When working with embedded C on the ESP32, consider these performance optimizations:

### Memory Management

The ESP32 has limited memory, so use it wisely:

1. **Avoid dynamic allocation in time-critical code**: Use stack allocation when possible.
2. **Free allocated memory**: Always match `malloc()` with `free()` to prevent memory leaks.
3. **Use static buffers for predictable memory usage**:

```c
// Instead of:
char *buffer = malloc(1024);
// Use:
static char buffer[1024];
```

1. **Monitor stack usage**:

```c
ESP_LOGI(TAG, "Free stack: %d bytes", uxTaskGetStackHighWaterMark(NULL));
```

### Compiler Optimization

Configure your project for optimal performance:

```bash
idf.py menuconfig
```

Navigate to "Compiler options" > "Optimization level" and select an appropriate level:

- `O0`: No optimization (best for debugging)
- `Og`: Optimize debugging experience
- `O2`: Optimize for performance
- `Os`: Optimize for size

### Power Management

Incorporate power saving techniques for battery-operated devices:

```c
#include "esp_pm.h"
#include "esp_sleep.h"

void app_main(void)
{
    // Configure power management
    esp_pm_config_esp32_t pm_config = {
        .max_freq_mhz = 240,
        .min_freq_mhz = 80,
        .light_sleep_enable = true
    };
    ESP_ERROR_CHECK(esp_pm_configure(&pm_config));

    // Your code here

    // Enter deep sleep mode
    ESP_LOGI(TAG, "Entering deep sleep for 10 seconds");
    esp_sleep_enable_timer_wakeup(10 * 1000000); // 10 seconds in microseconds
    esp_deep_sleep_start();
}
```

### Task Prioritization

In multi-task applications, prioritize tasks appropriately:

```c
void app_main(void)
{
    // Create a high-priority task for time-critical operations
    xTaskCreate(
        critical_task,
        "CRITICAL_TASK",
        2048,
        NULL,
        configMAX_PRIORITIES - 1,  // Highest priority
        NULL
    );

    // Create a lower-priority task for background operations
    xTaskCreate(
        background_task,
        "BACKGROUND_TASK",
        2048,
        NULL,
        tskIDLE_PRIORITY + 1,  // Just above idle priority
        NULL
    );
}
```

## Conclusion

Embedded C programming on the ESP32 with a Raspberry Pi as your development platform offers a powerful combination for IoT and embedded projects. The ESP-IDF framework provides a robust foundation for developing sophisticated applications, while the Raspberry Pi offers a convenient environment for development and integration.

In this article, we explored setting up the development environment, creating simple projects, establishing communication between devices, building a practical weather station application, and implementing debugging and optimization techniques.

Despite the growing popularity of other languages in the embedded space, C remains a fundamental skill for any embedded developer. Its efficiency, direct hardware access, and widespread support make it an ideal choice for resource-constrained environments like the ESP32.

## Further Resources

- [ESP-IDF Programming Guide](https://docs.espressif.com/projects/esp-idf/en/latest/)
- [ESP32 Technical Reference Manual](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- [FreeRTOS Documentation](https://www.freertos.org/Documentation/RTOS_book.html)
- [Espressif ESP32 Forum](https://www.esp32.com/)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)

With these resources and the techniques covered in this article, you have everything you need to start your journey into embedded C development with Raspberry Pi and ESP32. Happy coding!