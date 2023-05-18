#include <ESPAsyncWebServer.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <max6675.h>
#include <Ticker.h>
#include <ArduinoJson.h>

#define LED 14
#define Dx 19
#define CS 23
#define CLK 5

const char ssid[] = "ZNC Red";
char pass[20] = "147438106406";

float Sensor [9], forV[50], zero[3];
byte k = 2;
bool run = false;

Ticker forTemp;
Ticker forMPU;
Ticker forScreen;
Ticker forRun;
MAX6675 mx(CLK, CS, Dx);
Adafruit_MPU6050 mpu;
Adafruit_SSD1306 Screen = Adafruit_SSD1306(128, 32, &Wire);
AsyncWebServer server(80);
WiFiServer client(80);

void readMPU()
{
	sensors_event_t a, g, temp;
	mpu.getEvent(&a, &g, &temp);
	float x = a.acceleration.x,
		y = a.acceleration.y,
		z = a.acceleration.z;
	if (zero[0] == 0 && zero[1] == 0 && zero[2] == 0)
	{
		zero[0] = x;
		zero[1] = y;
		zero[2] = z;
	}
	for (byte i = 49; i > 0; i--)
		forV[i] = forV[i - 1];
	forV[0] = abs(sqrt((x * x) + (y * y) + (z * z)) - sqrt((zero[0] * zero[0]) + (zero[1] * zero[1]) + (zero[2] * zero[2]))) * 3.6;
	Sensor[0] = 0;
	for (byte i = 0; i < 50; i++)
		Sensor[0] += forV[i] * 0.02;
	//around to lower 
	Sensor[0] = round(Sensor[0] * 10) / 10;
}

void readTemp()
{
	Sensor[8] = mx.readCelsius();
}

void printScreen()
{
	Screen.clearDisplay();
	Screen.setRotation(2);
	Screen.setCursor(0, 0);
	if (run)
	{
		Screen.println("Sensores: " + String(k));
		Screen.println("Vel: " + String(Sensor[0]) + " km/h");
		Screen.println("Temp: " + String(Sensor[8]) + " *C");
	}
	else
	{
		IPAddress IP = WiFi.softAPIP();
		Screen.println("AP: " + String(ssid));
		Screen.println("PASS: " + String(pass));
		Screen.println("IP: " + String(IP[0]) + "." + String(IP[1]) + "." + String(IP[2]) + "." + String(IP[3]));
	}
	Screen.display();
}

void setup()
{
	pinMode(LED, OUTPUT);
	if (!mpu.begin()) {
		while (1)
			yield();
	}
	if (!Screen.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
		for (;;) ; 
	}

	Screen.setTextColor(WHITE);

	//for (byte i = 0 ; i < 12; i++)
	//	pass[i] = char(random(33, 126));

	WiFi.softAP(ssid, pass);
	IPAddress IP = WiFi.softAPIP();
	digitalWrite(LED, HIGH);

	server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
	{
		request->send(200, "text/plain", "OK"); 
	});
	server.on("/update", HTTP_GET, [](AsyncWebServerRequest *request)
	{
		run = true;

		StaticJsonDocument<200> jsonBuffer;
		JsonObject root = jsonBuffer.to<JsonObject>();
		root["k"] = k;
		JsonArray data = root.createNestedArray("data");
		for (byte i = 0; i < sizeof(Sensor) / sizeof(Sensor[0]); i++)
			data.add(Sensor[i]);
		String json;
		serializeJson(root, json);

		request->send(200, "text/json", json);
	});
	server.onNotFound([](AsyncWebServerRequest *request)
	{
		request->send(404, "text/plain", "Not found");
	});
	server.begin();
	forMPU.attach_ms(20, readMPU);
	forTemp.attach_ms(800, readTemp);
	forScreen.attach_ms(200, printScreen);
	forRun.attach_ms(5000, []()
	{
		run = false;
	});
}
void loop()
{
}
