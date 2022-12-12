# IoT-Based-Smart-Nursery-Health-Monitoring-System

Plants are really sensitive w.r.t. their environment parameters including temperature, moisture, sunlight, water level, soil nutrient etc. Considering a small / large scale Nursery Business owner it becomes difficult to monitor the health of every plant individually without manual cost intervention. Our Project will be dedicated to solve the challenging tradeoff between “maximize plant health/survival vs minimal effort and cost” using IOT. The designed system will monitor moisture, temperature and light level (can be customized based on individual plant requirement before deployment) and will be sending retrieved data / email to the owner (wifi module / web request / API) based on which event / action can be triggered or performed by the owner remotely which in return will improve plant health and survival eventually business profit as well. The project can also be improved with an automated irrigation system which would water the plants automatically based on the reading received from sensors or through website / app, and a security system, where the sensors would detect any object within a certain radius of the plant and alert the owner.

Prerequisites:

1. Node JS, npm
2. MongoDB/MongoDB Atlas
3. Arduino IDE installed (ESP 32 Board Support)
4. Android Studio Setup (Kotlin dev support environment)
5. Sensors : DHT11, soil moisture sensor, LDR
6. ESP32 (WiFi module, Support UART / GPIO data communication interface)
7. Other Hardware : Bread-Board, Jumper Wires, Resistor, LED, Relay, Water-Pump.

Repository Structure:

FinalIoTProject: Contains the INO file for Arduino IDE

Server: Contains the Node JS Server Code

Client: Contains the Android Client Code

\*\* All the devices (ESP32, Android Phone, Server running local machine) should be connected to the same WiFi network. (For testing purpose, you can use your mobile hotspot.

Instruction For Running Project:

1. Clone Repo
2. Open FinalIoTProject Folder in Arduino IDE and upload the code to ESP32
3. Note the IP Address of ESP32
4. Navigate to /server and run "npm install" to install all the dependencies
5. Update the IP Address of ESP32 in /server/server.js file (Line 10)
6. Run "npm start" to start the server
7. Note the IP Address of the server (For UNIX based OS, run "ifconfig" to get the IP Address. For Windows, run "ipconfig")
8. Open Android Studio and open the project in /client
9. Update the IP Address of the server in /client/app/src/main/java/com/example/plantsafe/PlantNetwork.kt (Line 11)
10. Run the app on your Android Phone

Android App Features:

1. View the list of plants
2. Add a new plant & store it in the database
3. View the details & current status of a plant
4. View the previous history of sensor data of a plant
5. Water the plant with a button click

Note: The app will not work if the server is not running. The server will not work if the ESP32 is not connected to the WiFi network.

Demo:
https://youtu.be/X9JzVd37De0
