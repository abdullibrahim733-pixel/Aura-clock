#!/usr/bin/env python3
import json
import subprocess
import sys
import time

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    Print("[ERROR] pyserial library is missing. Run 'pip install pyserial' to install it.")
    sys.exit(1)

SERIAL_PORT = "/dev/ttyUSB0"
BAUD_RATE = 115200
POLL_INTERVAL = 1.0


BLACKLIST = [
    "youtube.com",
    "netflix.com",
    "twitter.com",
    "instagram.com",
    "reddit.com",
    "facebook.com",
    "twitch.tv",
    "hulu.com",
    "spotify.com",
    "discord.com",
]


def find_esp32_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "USB" in port.device or "ACM" in port.device:
            return port.device
    return SERIAL_PORT

def get_active_window_title():
    try:
        window_id = subprocess.check_output([xdotool, "getactivewindow"]).strip()

        window_title = subprocess.check_output(["xdotool", "getwindowname", window_id]).decode("utf-8").strip()
        return window_title
    except subprocess.CalledProcessError:
        return "Desktop Environment Baseline"
    except FileNotFoundError:
        print("[ERROR] xdotool is not installed. Please install it using your package manager (e.g., 'sudo apt install xdotool').")
        sys.exit(1)


def main():
    target_port = find_esp32_port()
    print(f"                                                                          ")
    print(f"==========================================================================")
    print(f"          AURACLOCK - ENVIROMENT LISTENER DAMEON                          ")
    print(f"==========================================================================")
    print(f"[*] Attempting to connect to ESP32 on {target_port} at {BAUD_RATE} baud...")
    
    try:
        ser = serial.serial(target_port, BRAUD_RATE, timeout=1)
        time.sleep(2)
        print("[SUCCESS] serial interface pipeline established.")
    except Exception as e:
        print(f"[FATAL ERROR] could not openport {target_port}: {e}")
        print(f"[FIX] verify your USB-C cable is seat and user group privillages: sudo usermod -aG uucp $USER")
        sys.exit(1)

    last_state_was_breached = False
    print("\n[MONITORING] Scanning active windows boundaries... press Ctrl+C to exit.")

    ser.write(b'{"command": "RESET"}\n')

    try:
        while True:
            window_title = get_active_window_title()
            window_title_lower = window_title.lower()
        
        is_blacklisted = any(marker in window_title_lower for marker in BLACKLIST)
        if is_blacklisted and not last_state_was_breached:
            print(f"\n[BREACH DETECTED] Focused Target: \"{window_title}\"")
            print("|__ Status: sending lockdown JSON to auraclock hardware...")

            payload = {"command": "BREACH"}
            packet = json.dumps(paylosd) + "\n"

            ser.write(packet.encode('utf-8'))
            last_state_was_breached = True

        elif not is_blacklisted and last_state_was_breached:
            print(f"\n[FOCUSE REGAINED] focused target: \"{window_title}\"")
            print(f"Status: Releasing mechatronics blockout shutter...")

            payload = {"command": "RESET"}
            packet = json.dumps(payload) + "\n"

            ser.write(packet.encode('utf-8'))
            last_state_was_breached = False

        state_symbol = "🔴" if is_blacklisted else "🟢"
        sys.stdout.write(f"\r[{state_symbol}] currently Workspace Context: {window_title[:50]}... ")
        sys.stdout.flush()

        time.sleep(POLL_INTEERVAL)
        
    except KeyboardInterrupt:
        print("\n\n[TERMINATING] shutting down auraclock dameon...")
        try:
            ser.write(b'{"command": "RESET"}\n')
            ser.close()
        except Exception:
            pass
        print("[OFFLINE] Dameon process halted.")

if __name__ == "__main__":
    main()
