'use strict'

const fs = require('fs')
const path = require('path')
const globToRegExp = require('glob-to-regexp')

module.exports = (options) => {
    options = options || {}
    
    if (!options.baseDir) {
        throw new Error('options.baseDir is required!')
    }
    
    options.encoding = options.encoding || 'utf8'
    
    const firebase = typeof options.firebase === 'object' 
        ? options.firebase 
        : require(path.join(process.cwd(), options.firebase || '/firebase.json'))
    
    return (req, res, next) => {
        if (firebase.hosting.rewrites) {
            for (let rule of firebase.hosting.rewrites) {
                const re = globToRegExp(rule.source)
                const matches = re.exec(req.url)
                
                if (matches) {
                    if (req.url[req.url.length - 1] === '/') {
                        req.url = req.url.substr(0, req.url.length - 1)
                    }
                    
                    const filename = rule.destination.search(/\$/) === -1
                        ? rule.destination
                        : req.url.replace(re, rule.destination)
                    
                    const content = fs.readFileSync(path.join(options.baseDir, filename), options.encoding)
                    
                    res.write(content, options.encoding)
                    res.end()
                    
                    return true
                }
            }
        }
        
        next()
    }
}
