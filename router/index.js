const path = require('path')
const course = require('course')
const st = require('st')

const router = course()

const mount = st({
	path: path.join('__dirname', '..', 'public'),
	index: 'index.html',
	passthrought: true
})

function onRequest(req, res){
	mount(req, res, function(err){
		if(err) return fail(err, res)

		router(req, res, function(err){
			if (err) return fail(err, res)
			res.statusCode = 404
			res.end(`Not found ${req.url}`)
		})
	})
}

module.exports = onRequest