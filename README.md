# Building Proxy Server for log analysis using Node.js from scratch!

## Setup guide:

1. Clone the repo:
   ```bash
   git clone https://github.com/GopalVerma1303/LogAnalyser.git
   ```
2. Open dir:
   ```bash
   cd LogAnalyser
   ```
3. Run server.js
   ```bash
   node server.js
   ```
4. For MacOS:

   > Settings > Network > Proxies

   > Enable both **"Web Proxy"** and **"Secure Web Proxy"**

5. For Windows : 

   >Control Panel > Internet Options > Connections Tab 

   > LAN settings button > Check the "Use a proxy server for your LAN" checkbox

   >Enter the proxy server address and port
    
   -- To check if the proxy server is connected or not : netstat -antp | grep :8080 (in command prompt)

6. For Linux : 
   
   >sudo apt-get install net-tools > netstat --version   
   
   >sudo apt-get install squid > sudo nano /etc/squid/squid.conf (Insert "http_port 8080" at the end of the file)

   >sudo systemctl start squid
   
   >sudo systemctl enable squid

   >export http_proxy=http://localhost:8080
   >export https_proxy=http://localhost:8080

   >curl -x http://localhost:8080 -L http://google.com  (For testing)

## Documents:

- Presentation: https://docs.google.com/presentation/d/1jhQAbinbn-T6ZMLHpl9oEvHwAqGfM5BHatViXGwJdxk/edit?usp=sharing
- System Design: https://excalidraw.com/#json=MZND09UwzfqrgccYruq09,ZiFnk9dcBHeSaRavY36q3g
- Report: https://docs.google.com/document/d/11f6d72wv7VarsIh8xeakd8pbVveq_qXHNP-6VX1yYo8/edit?usp=sharing
