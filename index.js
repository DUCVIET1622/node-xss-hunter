#!/usr/bin/env node

const { Command } = require('commander')
const fs = require('fs')
const chalk = require('chalk')
const XSSScanner = require('./lib/scanner')
const BlindXSSServer = require('./lib/server')
const { defaultPayloads, wafBypassPayloads } = require('./lib/payloads')

const program = new Command()

program
  .name('xsshunter')
  .description('Node.js XSS Hunter - Lightweight XSS vulnerability scanner and blind XSS callback server')
  .version('1.0.0')

// Scan command
program
  .command('scan')
  .description('Scan for XSS vulnerabilities')
  .requiredOption('-u, --url <url>', 'Target URL (e.g., http://example.com/page.php)')
  .option('-p, --param <param>', 'Single parameter to test')
  .option('-w, --wordlist <file>', 'File containing parameters to test')
  .option('-m, --method <method>', 'HTTP method (GET/POST)', 'GET')
  .option('-t, --threads <number>', 'Concurrent requests', parseInt, 20)
  .option('--payloads <file>', 'Custom payloads file')
  .option('--waf-bypass', 'Use WAF bypass payloads', false)
  .option('-o, --output <file>', 'Output file', 'xss_results.json')
  .option('--timeout <ms>', 'Request timeout in ms', parseInt, 10000)
  .option('-c, --cookie <cookie>', 'Session cookie')
  .option('-a, --user-agent <ua>', 'Custom User-Agent')
  .option('--delay <ms>', 'Delay between requests in ms', parseInt, 0)
  .action(async (options) => {
    try {
      let params = []
      if (options.param) {
        params.push(options.param)
      } else if (options.wordlist) {
        const content = fs.readFileSync(options.wordlist, 'utf8')
        params = content.split('\n').filter(p => p.trim())
      } else {
        console.log(chalk.red('[-] Provide --param or --wordlist'))
        process.exit(1)
      }

      let payloads = [...defaultPayloads]
      if (options.payloads) {
        const content = fs.readFileSync(options.payloads, 'utf8')
        payloads = content.split('\n').filter(p => p.trim())
      }
      if (options.wafBypass) {
        payloads.push(...wafBypassPayloads)
      }

      const scanner = new XSSScanner({
        url: options.url,
        params,
        method: options.method,
        threads: options.threads,
        outputFile: options.output,
        timeout: options.timeout,
        cookie: options.cookie,
        userAgent: options.userAgent,
        delay: options.delay,
      })

      await scanner.scan(payloads)
    } catch (error) {
      console.log(chalk.red(`[-] Error: ${error.message}`))
      process.exit(1)
    }
  })

// Server command
program
  .command('server')
  .alias('listen')
  .description('Start blind XSS callback server')
  .option('-p, --port <port>', 'Port to listen on', parseInt, 8080)
  .option('-l, --log <file>', 'Log file path', 'blind_xss_log.txt')
  .action((options) => {
    const server = new BlindXSSServer({
      port: options.port,
      logFile: options.log,
    })
    server.start()
  })

// List payloads command
program
  .command('payloads')
  .description('List available XSS payloads')
  .option('--waf', 'Show WAF bypass payloads', false)
  .action((options) => {
    const payloads = options.waf ? wafBypassPayloads : defaultPayloads
    console.log(chalk.cyan(`\n${options.waf ? 'WAF Bypass' : 'Default'} Payloads (${payloads.length}):\n`))
    payloads.forEach((p, i) => {
      console.log(chalk.white(`  ${i + 1}. ${chalk.yellow(p)}`))
    })
    console.log()
  })

program.parse(process.argv)