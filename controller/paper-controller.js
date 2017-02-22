const Paper = require('../model/section');
const Section = require('../model/section');
const async = require('async');
const httpcode = require('../config/constant').httpcode;

class PaperController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Paper.find({}, (err, docs) => {
          async.map(docs, (paper, callback) => {
            Section.findOne({paper: paper._id})
                .populate('homeworks')
                .exec((err, doc) => {
                  if (err) {
                    return next(err);
                  }
                  var paperString = paper.toJSON();
                  callback(null, Object.assign({}, paperString, doc.toJSON()));
                }, done);
          })
        })
      },
      totalCount: (done) => {
        Paper.count(done);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    async.waterfall([
      (done) => {
        Paper.findById(req.params.paperId, done)
      },
      (paper,done) => {
        if(!paper) {
          return done({status:httpcode.NOT_FIND},null)
        }
        Section.findOne({paper:doc._id})
            .populate('homeworks')
            .exec((err,doc) => {
              const paperString = paper.toJSON();
              done(err,Object.assign(paperString,{sections:doc.toJSON()}));
            })
      }
    ], (err, result) => {
      if(err && err.status===httpcode.NOT_FIND) {
        return res.sendStatus(httpcode.NOT_FIND);
      }
      if(err){
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    })
  }

  create(req, res, next) {
    Paper.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `papers/${doc._id}`});
    })
  }

  delete(req, res, next) {
    const paperId = req.params.paperId;
    async.waterfall([
      (done) => {
        Paper.findByIdAndRemove(paperId,done)
      },
      (paper,done) => {
        if(!paper){
          return done({status:httpcode.NOT_FIND},null);
        }
        Section.find({paper:paperId},done)
      },
      (docs,done)=>{
        async.map(docs,(section,callback) => {
          Section.remove(section,callback)
        },done)
      }
    ],(err)=> {
      if(err&&err.status===httpcode.NOT_FIND){
        return res.sendStatus(httpcode.NOT_FIND);
      }
      if(err){
        return next(err);
      }
      res.sendStatus(httpcode.NO_CONTENT)
    });
  }

  update(req, res, next) {
    Paper.findByIdAndUpdate(req.params.paperId, req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(httpcode.NOT_FIND)
      }
      return res.sendStatus(httpcode.NO_CONTENT);
    })
  }
}

module.exports = PaperController;