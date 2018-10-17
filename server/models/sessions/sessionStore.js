class sessionStore {
  static createSession(user, req) {
    const localReq = { receivedReq: req };
    localReq.receivedReq.sessionStore.db.collection('sessions').find({}, (err, userSessions) => {
      userSessions.toArray((a, sessionsData) => {
        for (let i = 0; i < sessionsData.length; i += 1) {
          const session = JSON.parse(sessionsData[i].session);
          if (session.userId === user.id && sessionsData[i]._id !== localReq.receivedReq.session.id) {
            localReq.receivedReq.sessionStore.destroy(sessionsData[i]._id);
          }
        }
      });
    });
    localReq.receivedReq.session.userId = user._id;
  }
}

module.exports = sessionStore;
