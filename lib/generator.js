const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const rm = require('rimraf').sync;
const path = require('path');
module.exports = function (metadata = {}, src, dest = '.') {
 
  console.log('metadata=',metadata,'src=',src,'dest=',dest)
 src = path.join(src || '.','.tmp');
  dest = path.join(dest || '.');
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  console.log('src=',src)
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString();
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta.metadata));
        });
        done();
      }).build(err => {
      rm(src);
      err ? reject(err) : resolve()
    })
  })
};
