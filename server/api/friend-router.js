const friendRouter = require('express').Router();
const Friend = require('../../db/models/friend.js');
const User = require('../../db/models/user.js');
const oid = require('mongoose').Types.ObjectId;


// get friends of user - /friends
friendRouter.get('/', (req, res) => {
  Friend.find({from: oid(req.user._id)}).then(friends => {
    res.status(200).json(friends);
  });
});

// post - new friend request to existing user
friendRouter.post('/new/:friendId', (req, res) => {
  const fromId = oid(req.user._id);
  const toId = oid(req.params.friendId);
  Friend.find({from: fromId, to: toId}).then(fr => {
    if (fr) { throw new Error('fr_exists'); }
    const newFr = { from: fromId, to: toId, status: 'Pending' };
    return Friend.create(newFr);
  }).then(newFr => res.status(200).json({message: 'created', frId: newFr._id}))
    .catch(err => {
      if (err.message === 'fr_exists') {
        res.status(422).json('Friend request already exists');
      } else {
        res.status(500).json({message: 'Server error.', err});
      }
    });
});

// post - friend invite -
// TODO: send email to the invited friend
friendRouter.post('/invite', (req, res) => {
  const fromId = oid(req.user._id);
  const toEmail = req.params.toEmail;
  Friend.find({from: fromId, toEmail: toEmail}).then(fr => {
    if (fr) { throw new Error('fr_exists'); }
    const newFr = { from: fromId, toEmail: toEmail, status: 'Pending' };
    return Friend.create(newFr);
  }).then(newFr => res.status(200).json({message: 'created', frId: newFr._id}))
    .catch(err => {
      if (err.message === 'fr_exists') {
        res.status(422).json('Friend request already exists');
      } else {
        res.status(500).json({message: 'Server error.', err});
      }
    });
});

// put - accept friend request
friendRouter.put('/accept/:frId', (req, res) => {
  const toId = oid(req.user._id);
  Friend.findOneAndUpdate(
    {_id: oid(req.params.frId), to: toId},
    {status: 'Accepted'}
  ).then(fr => {
    if (!fr) { throw new Error('fr_not_found'); }
    res.status(200).json({message: 'updated', frId: fr._id});
  }).catch(err => {
    if (err.message === 'fr_not_found') {
      res.status(404).send();
    } else {
      res.status(500).json({message: 'Server error.', err});
    }
  });
});

// put - reject friend request

// put - cancel friend request


module.exports = friendRouter;
