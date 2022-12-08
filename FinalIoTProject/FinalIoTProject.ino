#include "DHT.h"
#include "WiFi.h"
#include "ESPAsyncWebServer.h"

int soilPin = 34;
int ldrPin = 33;
int dhtPin = 19;
// int redLed = 22;
// int greenLed = 23;

int counter = 0;

int moisture;
int moistureLimit = 3000;
bool soilDry = false;

int light;
int lightLimit = 2000;
bool isDark = false;

int temperature;
int temperatureLimit = 28;
bool highTemperature = false;

int humidity;
int humidityLowerLimit = 40;
int humidityHigherLimit = 70;
bool nonIdealHumidity = false;

int pumpPin = 18;
bool pumpState = false;
bool waternow = false;

const char *ssid = "Galaxy M31F3B6";
const char *password = "12456789";

AsyncWebServer server(80);

DHT dht(dhtPin, DHT11);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  dht.begin();
  pinMode(pumpPin, OUTPUT);
  pinMode(dhtPin, INPUT);
  pinMode(soilPin, INPUT);
  pinMode(ldrPin, INPUT);

  // pinMode(redLed, OUTPUT);
  // pinMode(greenLed, OUTPUT);

  // WiFi.softAP(ssid, password);
  // IPAddress ip = WiFi.softAPIP();
  // Serial.print("AP IP address: ");
  // Serial.println(ip);

  int status;

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi......");

  while ((status = WiFi.status()) != WL_CONNECTED) {
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.print("RRSI: ");
  Serial.println(WiFi.RSSI());

  server.on("/hello", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/plain", "Hello World!");
  });

  server.on("/moisture", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received request for moisture.");
    getMoistureValue();
    request->send_P(200, "text/plain", String(moisture).c_str());
  });

  server.on("/light", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received request for light.");
    getLightReading();
    request->send_P(200, "text/plain", String(light).c_str());
  });

  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received request for temperature.");
    getTemperatureReading();
    request->send_P(200, "text/plain", String(temperature).c_str());
  });

  server.on("/humidity", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Received request for humidity.");
    getHumidityReading();
    request->send_P(200, "text/plain", String(humidity).c_str());
  });

  server.on("/all", HTTP_GET, [](AsyncWebServerRequest *request) {
    getMoistureValue();
    getLightReading();
    getTemperatureReading();
    getHumidityReading();
    String sensorReadings = String(moisture) + String(",") + String(light) + String(",") + String(temperature) + String(",") + String(humidity);
    request->send_P(200, "text/plain", sensorReadings.c_str());
  });

  server.on("/waternow", HTTP_GET, [](AsyncWebServerRequest *request) {
    waternow = true;
    Serial.println("Request received to water now.");
    Serial.print("Water State: ");
    Serial.println(pumpState);
    // if (pumpState == false) {
      Serial.println("Starting water pump");
      digitalWrite(pumpPin, LOW);
      // pumpState = true;
      delay(2000);
      digitalWrite(pumpPin, HIGH);
      pumpState = false;
    // }
    waternow = false;
    request->send_P(200, "text/plain", "Watered");
  });

  // server.on("/plantsafe", HTTP_GET, [](AsyncWebServerRequest * request) {
  //   digitalWrite(greenLed, HIGH);
  //   digitalWrite(redLed, LOW);
  //   request->send_P(200, "text/plain", "Green");
  // });

  // server.on("/plantunsafe", HTTP_GET, [](AsyncWebServerRequest * request) {
  //   digitalWrite(greenLed, LOW);
  //   digitalWrite(redLed, HIGH);
  //   request->send_P(200, "text/plain", "Red");
  // });

  server.begin();

}

void getMoistureValue() {
  moisture = analogRead(soilPin);
  if (moisture > moistureLimit) {
    soilDry = true;
    if (pumpState == true) {
      digitalWrite(pumpPin, LOW);
      pumpState = false;
    }
  } else {
    soilDry = false;
    if (pumpState == false) {
      digitalWrite(pumpPin, HIGH);
      pumpState = true;
    }
  }
}

void getLightReading() {
  light = analogRead(ldrPin);
  if (light < lightLimit) {
    isDark = true;
  } else {
    isDark = false;
  }
}

void getTemperatureReading() {
  temperature = dht.readTemperature();
  if (temperature > temperatureLimit) {
    highTemperature = true;
  } else {
    highTemperature = false;
  }
}

void getHumidityReading() {
  humidity = dht.readHumidity();
  if (humidity >= humidityLowerLimit && humidity <= humidityHigherLimit) {
    nonIdealHumidity = false;
  } else {
    nonIdealHumidity = true;
  }
}

void loop() {
  // put your main code here, to run repeatedly:

  // if (waternow) {
  //   if (pumpState == false) {
  //       digitalWrite(pumpPin, HIGH);
  //       Serial.println("Starting water pump.");
  //       pumpState = true;
  //       delay(2000);
  //       digitalWrite(pumpPin, LOW);
  //       pumpState = false;
  //     }
  //     waternow = false;
  // } 
  // else {
  if (!waternow) {

    moisture = analogRead(soilPin);
    if (moisture > moistureLimit) {
      soilDry = true;
      if (!waternow) {
        if (pumpState == true) {
          digitalWrite(pumpPin, LOW);
          pumpState = false;
        }
      }
    } else {
      soilDry = false;
      if (!waternow) {
        if (pumpState == false) {
          digitalWrite(pumpPin, HIGH);
          pumpState = true;
        }
      }
    }
    // delay(1000);

    light = analogRead(ldrPin);
    if (light < lightLimit) {
      isDark = true;
    } else {
      isDark = false;
    }
    // // delay(2000);

    temperature = dht.readTemperature();
    if (temperature > temperatureLimit) {
      highTemperature = true;
    } else {
      highTemperature = false;
    }

    humidity = dht.readHumidity();
    if (humidity >= humidityLowerLimit && humidity <= humidityHigherLimit) {
      nonIdealHumidity = false;
    } else {
      nonIdealHumidity = true;
    }

  }

  // Serial.print("Moisture: ");
  // Serial.print(moisture);
  // Serial.print("\tLight: ");
  // Serial.println(light);
  // Serial.print("\tTemperature: ");
  // Serial.println(temperature);
  // Serial.print("C\tHumidity: ");
  // Serial.println(humidity);

  // delay(1000);
  delay(300);

}
