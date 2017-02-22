const Homework = require('../model/homework');
const Section = require('../model/section');
const async = require('async');
const httpcode = require('../config/constant').httpcode;

class HomeContorller {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Homework.find({}, (err, doc) => {
          if (err) {
            return next(err);
          }
          const data = doc.map(homework => {
            return Object.assign(homework, {uri: `homeworks/${homework._id}`})
          })
          return done(null, data);
        })
      },
      totalCount: (done) => {
        Homework.count(done);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Homework.findById(req.params.homeworkId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if(!doc){
        return res.sendStatus(httpcode.NOT_FIND)
      }
      return res.status(httpcode.OK).send(Object.assign(doc, {uri: `homeworks/${doc._id}`}));
    })
  }

  create(req, res, next) {
    Homework.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `homeworks/${doc._id}`});
    })
  }

  delete(req, res, next) {
    const homeworkId = req.params.homeworkId;
    async.waterfall([
      (done) => {
        Section.findOne({'homeworks': homeworkId}, done)
      },
      (doc, done) => {
        if (doc) {
          return done(true, null);
        }
        Homework.findByIdAndRemove(req.params.homeworkId, done)
      }
    ], (err, result) => {

      if (err === true) {
        return res.sendStatus(httpcode.BAD_REQUEST)
      }
      if (!result) {
        return res.sendStatus(httpcode.NOT_FIND);
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(httpcode.NO_CONTENT);
    })
  }

  update(req, res, next) {
    Homework.findByIdAndUpdate(req.params.homeworkId, req.body, (err, doc) => {
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

module.exports = HomeContorller;
