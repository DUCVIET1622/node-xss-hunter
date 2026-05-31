<p align="center">
  <img src="https://img.shields.io/badge/NODE.JS-18.x-blue?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/PLATFORM-Windows%20%7C%20Linux-bluegrey?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-brightgreen?style=for-the-badge" />
</p>


### 👤 Author
**DUCVIET1622**

# NODE XSS-HUNTER

- Tấn công kịch bản chéo trang ( cross site scripting / cwe-79 )
- Tấn công kịch bản chéo trang ( cwe-79 )hoạt động bằng cách thao túng một trang web dễ bị tổn thương để nó trả về mã JavaScript độc hại cho người dùng. Khi mã độc hại được thực thi bên trong trình duyệt của nạn nhân, kẻ tấn công có thể hoàn toàn xâm phạm trải nghiệm tương tác của họ với ứng dụng.


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






<h2>Cài đặt</h2>

<pre>
git clone https://github.com/DUCVIET1622/node-xss-hunter.git
cd node-xss-hunter
npm install
</pre>

<h2>Xem trợ giúp</h2>

<pre>
node index.js --help
</pre>

</div>

</body>
</html>


