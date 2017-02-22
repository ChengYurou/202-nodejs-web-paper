const Section = require('../model/section');
const async = require('async');
const httpcode = require('../config/constant').httpcode;

class SectionController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Section.find({})
            .populate('homeworks', 'paper')
            .exec((err, docs) => {
              if (err) {
                return next(err);
              }
              return done(null, docs);
            });
      },
      totalCount: (done) => {
        Section.count(done);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Section.findById(req.params.sectionId)
        .populate('paper', 'homeworks')
        .exec((err, doc)=> {
          if (err) {
            return next(err);
          }
          if (!doc) {
            return res.sendStatus(httpcode.NOT_FIND)
          }
          return res.status(httpcode.OK).send(doc);

        })
  }

  create(req, res, next) {
    Section.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `sections/${doc._id}`});
    })
  }

  delete(req, res, next) {
    const sectionId = req.params.sectionId;
    Section.findByIdAndRemove(sectionId,(err,doc) => {
      if(err){
        return next(err);
      }
      if(!doc) {
        return res.sendStatus(httpcode.NOT_FIND)
      }
      res.sendStatus(httpcode.NO_CONTENT);
    })
  }

  update(req, res, next) {
    Section.findByIdAndUpdate(req.params.sectionId, req.body, (err, doc) => {
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

module.exports = SectionController;