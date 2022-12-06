/*
COMMON INSTRUCTION BEFORE RUNNING CODE

1) Set monitor_speed = 115200 ---> clear O/P on serial monitor 

2)Arduino IDE and go to Sketch > Include Library > Manage Libraries
 Search for “DHT” on the Search box and install the DHT library from Adafruit

3) HARDWARE CONNECITON - DHT 11
pin 1 (on the left) of the sensor to 3v3
Connect pin 2 of the sensor to GPIO 13 ESP
Connect pin 4 (on the right) of the sensor to GND
Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

4) Include 2 external library that need to be added in order to establish wifi connection
   a)ESPAsyncWebServer 
   b)Async TCP
*/


#include "DHT.h"
//#include <Adafruit_Sensor.h>

#include "WiFi.h"
#include "ESPAsyncWebServer.h"

const char *ssid = "nursery_AP";
const char *password = "12345";
int max_connection =2;    // edit 
AsyncWebServer server(80);        //port 80

#define DHTPIN 13     // DHT sensor -> ESP GPIO PIN 13
#define DHTTYPE DHT11 // DHT 11

#define SOILPIN 14 // soil sensor ESP GPIO 14 connect

#define LIGHT_SENSOR_PIN 36 // LDR sensor ESP GPIO 36 connect 

// DHT 11 reading variable
float temp_f = 0.0;
float temp_c = 0.0;
float hum = 0.0;
float hi_f = 0.0; // heat index F
float hi_c = 0.0; // heat index C

// Soil Sensor reading variable
int soil_val = 0;
int soil_limit = 300;     // threshold for soil sensor
bool is_soil_dry = false; // check if soil dry

//LDR sensor reading variable 
int ldr_val =0; 
bool is_dark = false;
bool is_bright = false;



// function DHT -> set value for temp and humidity
void get_valDHT()
{
  temp_f = dht.readTemperature(true);
  temp_c = dht.readTemperature(); // default
  hum = dht.readHumidity();
  hi_f = dht.computeHeatIndex(f, hum); // Heat index
  hi_c = dht.computeHeatIndex(f, hum);
  delay(2000); // DHT is a slow senosr --> 2 sec delay before next reading
}

void print_valDHT() // print temp humidity on serial monitor
{
  Serial.print(F("Humidity: "));
  Serial.print(hum);
  Serial.print(F("%  Temperature: "));
  Serial.print(temp_c);
  Serial.print(F("°C "));
  Serial.print(temp_f);
  Serial.print(F("°F  Heat index: "));
  Serial.print(hi_c);
  Serial.print(F("°C "));
  Serial.print(hi_f);
  Serial.println(F("°F"));
}
// Initialize DHT sensor.
DHT dht(DHTPIN, DHTTYPE);

void get_valSoil() // get soil moisture value --> check if dry or not
{

  // TODO : add water pump working code if soil dry 
  soil_val = analogRead(SOILPIN);
  if (soil_val < soil_limit)
  {
    is_soil_dry = true;
  }
  else
  {
    is_soil_dry = false;
  }

  delay(1000);
}

void print_valSoil() //print soil moisture value on serial monitor
{
  Serial.println("Soil Sensor Moisture Value: ");
  Serial.println(soil_val);
}

void get_valLDR() // set and check LDR reading into varialbe 
{
  ldr_val = analogRead(LIGHT_SENSOR_PIN);
  if (ldr_val < 2000) {
    is_dark = true;
    is_bright =false;
  } else 
  {
    is_bright=true;
    is_dark = false;
  }

}
void print_valLdr() //print LDR value on serial monitor 
{
  Serial.println("LDR Lighgt Value = ");
  Serial.print(ldr_val);   
}


/*
Below 4 Functions return respective value on http-request
for : moisture, temperature, humidity and combined 

request : 
http://192.168.4.1/mois
http://192.168.4.1/hum
http://192.168.4.1/temp
http://192.168.4.1/comb
*/
String moisture()
{
   String res = "";
   res = to_string(soil_val);
   return res;
}
String temperature()
{
   String res = "";
   res = to_string(temp_f);
   return res;
}
String humidity()
{
   String res = "";
   res = to_string(hum);
   return res;
}
String combine()
{
//TODO : Disscuss with team 
// Do we need to concatenate all 3 values into single string and return ? 
}


 

void setup()
{
   Serial.begin(115200);
   WiFi.softAP(ssid, password,1,0,max_connection);
   IPAddress IP = WiFi.softAPIP();
   Serial.print("AP IP address: ");
   Serial.println(IP);
   // IP :  192.168.4.1
   
   dht.begin(); // DHT Sensor Begin 

   //http response -> moisture 
   server.on("/mois", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send_P(200, "text/plain", moisture().c_str()); });

  //http response -> temperature 
   server.on("/temp", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send_P(200, "text/plain", temperature().c_str()); });

  //http response -> humidity 
   server.on("/hum", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send_P(200, "text/plain", humidity().c_str()); });

  //http response -> comb 
    server.on("/comb", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send_P(200, "text/plain", combine().c_str()); });
  
   server.begin();
  
}

void loop()
{
  
  //can modify sequence and delay of function base on need 
  get_valDHT(); 
  print_valDHT();

  delay(3000);

  get_valSoil();
  print_valSoil();

  delay(3000);

  get_valLDR();
  print_valLdr();

  delay(3000);

}
