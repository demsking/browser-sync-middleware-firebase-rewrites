'use strict'

const fs = require('fs'),
      path = require('path'),
      mocha = require('mocha'),
      assert = require('assert'),
      middleware = require('../')

const info = require('../package.json')
const BASE_DIR = './dist'

let req = { url: '/about'}
const res = {
    write: body => {
        const title = req.url.substring(1) || 'index'
        const re = new RegExp('<title>(' + title + ')</title>', 'i')
        const matches = re.exec(body)
        
        assert.notEqual(null, matches)
        assert.equal(title, matches[1])
    },
    end: () => {}
}

process.chdir('tests')

describe(info.name, () => {
    
    it('should find firebase file in the CWD and parse rewrites rules', (next) => {
        var instance = middleware({ baseDir: BASE_DIR })
        
        if (instance(req, res, next)) {
            return next()
        }
        
        assert.fail(req.url, null, `Failed to rewrite ${req.url}
        `)
    })
    
    it('should load firebase file using filename and parse rewrites rules', (next) => {
        var instance = middleware({ 
            baseDir: BASE_DIR, 
            firebase: './src/firebase.json' })
        
        if (instance(req, res, next)) {
            return next()
        }
        
        assert.fail(req.url, null, `Failed to rewrite ${req.url}
        `)
    })
    
    it('should load firebase object and parse rewrites rules', (next) => {
        var instance = middleware({ 
            baseDir: BASE_DIR, 
            firebase: require('./src/firebase.json') })
        
        if (instance(req, res, next)) {
            return next()
        }
        
        assert.fail(req.url, null, `Failed to rewrite ${req.url}
        `)
    })
    
    it('should load firebase file and parse rewrites rules with glob', (next) => {
        var instance = middleware({ 
            baseDir: BASE_DIR, 
            firebase: require('./src/firebase.json') })
        
        req.url = '/contact'
        
        if (instance(req, res, () => {})) {
            return next()
        }
        
        assert.fail(req.url, null, `Failed to rewrite ${req.url}
        `)
    })
    
    it('should load firebase file and found index rewrite rule', (next) => {
        var instance = middleware({ 
            baseDir: BASE_DIR, 
            firebase: require('./src/firebase.json') })
        
        req.url = '/'
        
        if (instance(req, res, () => {})) {
            return next()
        }
        
        assert.fail(req.url, null, `Failed to rewrite ${req.url}`)
    })
    
    it('should load firebase file and failed', (next) => {
        var instance = middleware({ baseDir: BASE_DIR })
        
        req.url = '/unknow/url'
        
        if (instance(req, res, () => {})) {
            return assert.fail(req.url, null, `No rule for ${req.url}`)
        }
        
        next()
    })
    
    it('should load firebase file and throwed', (next) => {
        assert.throws(() => middleware())
        
        next()
    })
})
