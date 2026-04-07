#include <ESP32Servo.h>

// --- PIN DEFINITIONS ---
const int RELAY_PIN = 4;
const int SERVO_PIN = 13; // Pin sinyal untuk Micro Servo

// --- KONFIGURASI RELAY ---
const int RELAY_AKTIF = LOW;  
const int RELAY_MATI = HIGH;

// --- KONFIGURASI SUDUT SERVO ---
// Nilai ini HARUS Anda ubah-ubah (kalibrasi) sesuai posisi fisik servo nanti
const int SUDUT_DIAM = 90;    // Posisi awal, lengan servo tidak menyentuh tuas
const int SUDUT_DORONG = 0; // Posisi lengan servo menekan tuas solenoid

Servo pendorongServo;

void setup() {
  Serial.begin(115200);

  // 1. Inisialisasi Relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_MATI); // Kunci pintu

  // 2. Inisialisasi Servo
  pendorongServo.attach(SERVO_PIN);
  pendorongServo.write(SUDUT_DIAM); // Pastikan servo minggir di awal

  Serial.println("Sistem Siap. Pintu terkunci.");
  delay(2000);
}

void loop() {
  // --- FASE UNLOCK (MEMBUKA PINTU & MENDORONG TUAS) ---
  Serial.println("Membuka kunci (Solenoid ON)...");
  
  // 1. Nyalakan medan magnet solenoid dulu
  digitalWrite(RELAY_PIN, RELAY_AKTIF); 
  
  // Beri jeda 200 milidetik agar magnet aktif sebelum didorong servo
  delay(200); 
  
  // 2. Servo bergerak menekan tuas
  Serial.println("Servo mendorong tuas...");
  pendorongServo.write(SUDUT_DORONG); 

  // Tahan pintu dalam keadaan terbuka selama 3 detik
  delay(3000); 

  // --- FASE LOCK (MENGUNCI KEMBALI) ---
  // 1. Tarik mundur servo dulu agar tidak menghalangi pegas solenoid
  Serial.println("Servo ditarik mundur...");
  pendorongServo.write(SUDUT_DIAM); 
  
  // Beri waktu 500 milidetik untuk pergerakan fisik servo sampai selesai
  delay(500); 

  // 2. Matikan relay (Pegas solenoid akan otomatis menendang tuas keluar)
  Serial.println("Mengunci kembali (Solenoid OFF)...");
  digitalWrite(RELAY_PIN, RELAY_MATI);

  // Tahan posisi terkunci selama 3 detik sebelum siklus mengulang
  delay(3000);
}