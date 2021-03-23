class FriendsList {
  friends: string[] = [];

  addFriend(name: string) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name: string) {
    global.console.log(`${name} is now a friend!`);
  }

  removeFriend(name: string) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found');
    }

    this.friends.splice(idx, 1);
  }
}

describe('FriendsList', () => {
  let friendsList: FriendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('Max');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('annouces friendship', () => {
    friendsList.announceFriendship = jest.fn();

    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Max');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Max');
  });

  describe('removes friend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('Max');
      expect(friendsList.friends[0]).toEqual('Max');
      friendsList.removeFriend('Max');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throws an error as friend does not exist', () => {
      expect(() => friendsList.removeFriend('Max')).toThrow(
        new Error('Friend not found'),
      );
    });
  });
});
